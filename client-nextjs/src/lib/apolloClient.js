"use client";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
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

// HTTP 연결을 위한 링크
const httpLink = createHttpLink({
  uri: getServerUrl(),
  credentials: "same-origin",
});

// 인증 정보와 언어 설정을 추가하는 링크
const authLink = setContext((_, { headers }) => {
  let token = null;
  let currentLanguage = 'ko';

  if (typeof window !== "undefined") {
    // 토큰 가져오기
    token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

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
      authorization: token ? `Bearer ${token}` : "",
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
  // errorLink가 가장 먼저 오도록 설정하여 모든 에러를 중앙에서 처리
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
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});