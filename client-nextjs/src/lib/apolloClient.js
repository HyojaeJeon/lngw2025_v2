
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// 환경별 GraphQL 엔드포인트 설정
const getGraphQLUri = () => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 내부 URL 사용
    return process.env.REPLIT === 'true' 
      ? 'http://0.0.0.0:5000/graphql'
      : 'http://localhost:5000/graphql';
  }
  
  // 클라이언트 사이드에서는 현재 호스트 기반으로 URL 생성
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = process.env.NODE_ENV === 'production' ? '' : ':5000';
  
  return `${protocol}//${hostname}${port}/graphql`;
};

// HTTP 링크 생성
const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  credentials: 'include',
});

// 인증 링크
const authLink = setContext((_, { headers }) => {
  let token = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  };
});

// 에러 링크
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.log('GraphQL error:', { message, locations, path, extensions });
      
      // 인증 에러 처리
      if (extensions?.code === 'AUTHENTICATION_ERROR') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.log('Network error:', networkError);
  }
});

// Apollo Client 생성
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
          users: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          vocs: {
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
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
