import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { SUBGRAPH_BASE_URL } from 'src/constants'

import { GraphQLClient } from 'graphql-request'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/exchange`
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const governanceClient = new ApolloClient({
  link: new HttpLink({
    uri: `${SUBGRAPH_BASE_URL}/governance`
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const mininchefV2Client = new GraphQLClient(
  'https://graph.kalychain.io/subgraphs/name/kalyswap/minichef-dummy',
  { headers: {} }
)

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.kalychain.io/subgraphs/name/kalyswap/kalychain-blocks'
  }),
  cache: new InMemoryCache()
})
