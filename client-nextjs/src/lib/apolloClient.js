
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
    if (origin.includes("replit.dev")) {
      // Replit 환경에서는 같은 도메인의 다른 포트 사용
      return origin.replace(":3002", "") + "/graphql";
    }
    return "http://localhost:5000/graphql";
  }
  // 서버에서 실행될 때
  return "http://localhost:5000/graphql";
};

const httpLink = createHttpLink({
  uri: getServerUrl(),
  credentials: "same-origin", // same-origin으로 변경
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
          "CORS error detected. Please check server configuration.",
        );
      }

      if (networkError.statusCode === 401) {
        localStorage.removeItem("auth_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  },
);

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
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
