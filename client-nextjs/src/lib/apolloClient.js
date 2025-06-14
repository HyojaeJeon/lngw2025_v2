import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// GraphQL 서버 URL 설정
const isReplit = !!(process.env.NEXT_PUBLIC_REPLIT || 
  typeof window !== 'undefined' && 
  (window.location.hostname.includes('replit.dev') || 
   window.location.hostname.includes('replit.co')));

const getGraphQLUri = () => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 환경변수 기반으로 결정
    return process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql';
  }

  // 클라이언트 사이드에서는 현재 origin 기반으로 결정
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;

  if (isReplit) {
    // Replit 환경에서는 동일한 호스트의 5000번 포트 사용
    return `${protocol}//${hostname}:5000/graphql`;
  }

  // 로컬 개발 환경
  return 'http://localhost:5000/graphql';
};

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
});

// 현재 origin 로깅
if (typeof window !== 'undefined') {
  console.log('Apollo Client Server URL:', getGraphQLUri());
  console.log('Current origin:', window.location.origin);
}

// 토큰 재발급 함수
const refreshAccessToken = async () => {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(getGraphQLUri(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
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
        `,
        variables: { refreshToken }
      }),
    });

    const result = await response.json();

    if (result.data?.refreshToken) {
      const { accessToken, refreshToken: newRefreshToken, user } = result.data.refreshToken;

      // 새 토큰들을 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return accessToken;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Auth Link 설정
const authLink = setContext(async (_, { headers }) => {
  // localStorage에서 토큰 가져오기
  let token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Error Link 설정 - 토큰 재발급 로직 포함
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.log('GraphQL error:', { 
        message: err.message, 
        locations: err.locations, 
        path: err.path, 
        extensions: err.extensions 
      });

      // 인증 오류 처리
      if (err.extensions?.code === 'AUTHENTICATION_ERROR' || 
          err.extensions?.errorKey === 'AUTHENTICATION_REQUIRED') {

        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

        if (refreshToken) {
          // 토큰 재발급 시도
          return new Promise((resolve) => {
            refreshAccessToken()
              .then((newAccessToken) => {
                // 새 토큰으로 헤더 업데이트
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                });

                // 원래 요청 재시도
                resolve(forward(operation));
              })
              .catch(() => {
                // 토큰 재발급 실패 시 로그인 페이지로 리디렉션
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                  window.location.href = '/login';
                }
                resolve();
              });
          });
        } else {
          // 리프레시 토큰이 없으면 로그인 페이지로 리디렉션
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/login';
          }
        }
      }
    }
  }

  if (networkError) {
    console.log(`Network error: ${networkError}`);
  }
});

// Retry Link - 네트워크 오류 시 재시도
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => !!error && !error.message.includes('Authentication')
  }
});

// Apollo Client 인스턴스 생성
const client = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;