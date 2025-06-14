import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// 현재 환경에 따른 GraphQL 엔드포인트 설정
const getGraphQLUri = () => {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 내부 URL 사용
    return 'http://localhost:5000/graphql';
  }

  // 클라이언트사이드에서는 현재 호스트 기반으로 설정
  const currentOrigin = window.location.origin;
  console.log('Apollo Client Server URL:', `${currentOrigin.replace(':3000', ':5000')}/graphql`);
  console.log('Current origin:', currentOrigin);

  return `${currentOrigin.replace(':3000', ':5000')}/graphql`;
};

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  let token = null;

  if (typeof window !== 'undefined') {
    // 브라우저 환경에서는 localStorage에서 토큰 가져오기
    token = localStorage.getItem('token');

    // Redux store에서도 확인
    try {
      const persistedState = localStorage.getItem('persist:auth');
      if (persistedState) {
        const authState = JSON.parse(persistedState);
        const authData = JSON.parse(authState.auth || '{}');
        if (authData.token && !token) {
          token = authData.token;
        }
      }
    } catch (error) {
      console.warn('Redux persist token 읽기 실패:', error);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
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
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;