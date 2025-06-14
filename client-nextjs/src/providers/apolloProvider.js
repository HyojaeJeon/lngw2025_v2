
"use client";

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apolloClient';

export function ApolloProviderWrapper({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}

export default ApolloProviderWrapper;
