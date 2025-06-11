"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
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
      const baseUrl = origin.replace(/:3000$/, ''); // 3000 포트 제거
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

const httpLink = createHttpLink({
  uri: getServerUrl(),
  credentials: "include", // Replit에서 쿠키 전송을 위해 include로 변경
  headers: {
    "Content-Type": "application/json",
  },
});

const authLink = setContext((_, { headers }) => {
  let token = null;

  if (typeof window !== "undefined") {
    // localStorage 또는 sessionStorage에서 토큰 조회
    token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
  }

  // Redux 스토어에서 현재 언어 설정 가져오기
  let currentLanguage = "ko";
  try {
    currentLanguage = selectCurrentLanguage(store.getState()) || "ko";
  } catch (error) {
    console.warn("Failed to get language from store:", error);
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Accept-Language": currentLanguage,
      "Content-Type": "application/json",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }

    if (networkError) {
      console.error(`Network error:`, networkError);

      // AbortError 처리 - 무시하고 계속 진행
      if (networkError.name === "AbortError") {
        console.log("Request was aborted, ignoring...");
        return;
      }

      // CORS 오류 처리
      if (networkError.message && networkError.message.includes("CORS")) {
        console.error(
          "CORS error detected. Server URL:",
          getServerUrl()
        );
        console.error(
          "Current origin:",
          typeof window !== "undefined" ? window.location.origin : "SSR"
        );
      }

      if (networkError.statusCode === 401) {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  },
);

// Apollo Client 로깅 (개발 환경에서만)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("Apollo Client Server URL:", getServerUrl());
  console.log("Current origin:", window.location.origin);
}

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
