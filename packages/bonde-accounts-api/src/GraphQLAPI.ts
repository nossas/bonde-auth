import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, concat } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import logger from './logger';

dotenv.config()

if (!process.env.JWT_TOKEN && !process.env.HASURA_SECRET) {
  throw new Error('Please specify the `JWT_TOKEN` or `HASURA_SECRET` environment variable.')
}

const uri: string = process.env.GRAPHQL_HTTP_URL || 'http://localhost:3000/graphql'

logger.info(`Connect GraphQL API on ${uri}...`)

// Create an http link:
const httpLink = new HttpLink({ uri, fetch: fetch as any })

// Create auth middleware for http request
const authMiddleware = new ApolloLink((operation, forward) => {
  const headers = process.env.JWT_TOKEN ? {
    Authorization: `Bearer ${process.env.JWT_TOKEN}`
  } : {
    'x-hasura-admin-secret': process.env.HASURA_SECRET
  }

  operation.setContext({ headers })
  return forward(operation)
})

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})