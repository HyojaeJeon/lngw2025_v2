
"use client";

import { ApolloProvider as ApolloClientProvider } from '@apollo/client';
import apolloClient from '@/lib/apolloClient.js';

export default function ApolloProvider({ children }) {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  );
}
