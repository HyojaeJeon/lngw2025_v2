import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP 링크 생성
const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' 
    ? 'https://1af219cc-4238-4cc1-b774-03457e5a48ad-00-1dqbl6swyb0bu.kirk.replit.dev:5000/graphql'
    : 'http://0.0.0.0:5000/graphql',
});

// 인증 링크 생성
const authLink = setContext((_, { headers }) => {
  // 로컬 스토리지에서 토큰 가져오기
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || localStorage.getItem('authToken');
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// 에러 링크 생성
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.log('GraphQL error:', { message, locations, path, extensions });

      // 인증 에러 처리
      if (extensions?.code === 'AUTHENTICATION_ERROR') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
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
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Customer: {
        fields: {
          contacts: {
            merge: false,
          },
          images: {
            merge: false,
          },
        },
      },
      CustomerActivity: {
        fields: {
          participants: {
            merge: false,
          },
          attachments: {
            merge: false,
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