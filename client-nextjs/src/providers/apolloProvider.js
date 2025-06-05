
'use client'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apolloClient.js'

export function ApolloProviderWrapper({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
}
