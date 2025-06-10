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

const CURSOR_URL = "http://localhost:50001/graphql";
const REPLIT_URL = "https://1af219cc-4238-4cc1-b774-03457e5a48ad-00-1dqbl6swyb0bu.kirk.replit.dev/graphql";

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : CURSOR_URL,
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
  const currentLanguage = selectCurrentLanguage(store.getState());

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Accept-Language": currentLanguage || "ko", // 기본값은 한국어
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
      console.error(`Network error: ${networkError}`);

      // AbortError 처리 - 무시하고 계속 진행
      if (networkError.name === "AbortError") {
        console.log("Request was aborted, ignoring...");
        return;
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
  },
});