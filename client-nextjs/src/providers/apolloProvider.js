'use client'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apolloClient.js'
import { createUploadLink } from "apollo-upload-client/createUploadLink.mjs";

export function ApolloProviderWrapper({ children }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
}