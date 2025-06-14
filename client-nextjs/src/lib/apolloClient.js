
"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { gql } from "@apollo/client";
import errorLink from "../apollo/errorLink";
import { store } from "../store";
import { selectCurrentLanguage } from "../store/slices/languageSlice";

// 서버 URL 설정 - Replit 환경에 맞게 수정
const getServerUrl = () => {
  if (typeof window !== "undefined") {
    // 클라이언트에서 실행될 때
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    // Replit 환경 감지
    if (hostname.includes("replit.dev")) {
      // Replit 환경에서는 현재 호스트의 포트 80(서버)으로 연결
      const baseUrl = origin.replace(/:3000$/, ""); // 3000 포트 제거
      return `${baseUrl}/graphql`;
    }

    // 로컬 개발 환경
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/graphql";
    }

    // 기본값
    return `${origin}/graphql`;
  }

  // 서버에서 실행될 때 (SSR)
  return "http://localhost:5000/graphql";
};

// HTTP 연결을 위한 링크
const httpLink = createHttpLink({
  uri: getServerUrl(),
  credentials: "same-origin",
});

// 토큰 새로고침 뮤테이션
const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        email
        name
        role
      }
    }
  }
`;

// 토큰 저장 유틸리티
const getStoredTokens = () => {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };
  
  const accessToken = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
  
  return { accessToken, refreshToken };
};

const setStoredTokens = (accessToken, refreshToken) => {
  if (typeof window === "undefined") return;
  
  if (accessToken) {
    localStorage.setItem("auth_token", accessToken);
    sessionStorage.setItem("auth_token", accessToken);
  }
  
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
    sessionStorage.setItem("refresh_token", refreshToken);
  }
};

const clearStoredTokens = () => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("refresh_token");
};

// 토큰 새로고침 함수
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const refreshTokens = async () => {
  const { refreshToken } = getStoredTokens();
  
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(getServerUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION.loc.source.body,
        variables: { refreshToken },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data.refreshToken;
    setStoredTokens(newAccessToken, newRefreshToken);
    
    return newAccessToken;
  } catch (error) {
    clearStoredTokens();
    // 로그인 페이지로 리다이렉트
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw error;
  }
};

// 에러 링크 - 토큰 만료 시 자동 갱신
const authErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === "AUTHENTICATION_ERROR" || err.extensions?.errorKey === "AUTHENTICATION_REQUIRED") {
        if (!isRefreshing) {
          isRefreshing = true;
          
          return new Promise((resolve, reject) => {
            refreshTokens()
              .then((newToken) => {
                isRefreshing = false;
                processQueue(null, newToken);
                
                // 실패한 요청 재시도
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newToken}`,
                  },
                });
                
                resolve(forward(operation));
              })
              .catch((error) => {
                isRefreshing = false;
                processQueue(error, null);
                reject(error);
              });
          });
        } else {
          // 이미 토큰 갱신 중인 경우 대기
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${token}`,
              },
            });
            
            return forward(operation);
          });
        }
      }
    }
  }
  
  if (networkError) {
    console.error("Network error:", networkError);
  }
});

// 인증 정보와 언어 설정을 추가하는 링크
const authLink = setContext((_, { headers }) => {
  const { accessToken } = getStoredTokens();
  let currentLanguage = "ko";

  if (typeof window !== "undefined") {
    // 현재 언어 가져오기
    try {
      const state = store.getState();
      currentLanguage = selectCurrentLanguage(state);
    } catch (error) {
      console.warn("Could not get current language from store:", error);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Accept-Language": currentLanguage,
      "Content-Type": "application/json",
    },
  };
});

// Apollo Client 로깅 (개발 환경에서만)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("Apollo Client Server URL:", getServerUrl());
  console.log("Current origin:", window.location.origin);
}

// Apollo Client 인스턴스 생성
export const apolloClient = new ApolloClient({
  // 에러 링크가 가장 먼저 오도록 설정
  link: from([authErrorLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          customers: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          salesOpportunities: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          categories: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          products: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          salesItems: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          salesReps: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "cache-first",
    },
  },
});

// 토큰 관리 유틸리티 export
export { getStoredTokens, setStoredTokens, clearStoredTokens };
