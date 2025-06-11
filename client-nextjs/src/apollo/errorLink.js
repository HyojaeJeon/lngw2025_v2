
'use client';

import { onError } from '@apollo/client/link/error';
import { handleGraphQLErrors } from './handlers/graphqlErrorHandler';
import { handleNetworkError } from './handlers/networkErrorHandler';

/**
 * Apollo Client의 에러 처리를 담당하는 errorLink
 * GraphQL 에러와 네트워크 에러를 각각의 핸들러에게 위임
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // GraphQL 에러 처리
  if (graphQLErrors) {
    handleGraphQLErrors(graphQLErrors);
  }

  // 네트워크 에러 처리
  if (networkError) {
    handleNetworkError(networkError);
  }
});

export default errorLink;
