import { useMemo } from 'react';
import { ApolloClient, ApolloLink, split, InMemoryCache, NormalizedCacheObject, createHttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
const DEV_ENDPOINT = 'http://localhost:6688/graphql';
const DEV_WS_ENDPOINT = 'ws://localhost:6688/graphql';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'development' ? DEV_ENDPOINT : process.env.NEXT_PUBLIC_PROD_ENDPOINT, // Server URL (must be absolute)
  fetchOptions: {
    credentials: 'include', // Additional fetch() options like `credentials` or `headers`,
  },
});

const wsLink = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri:
        process.env.NODE_ENV === 'development'
          ? (DEV_WS_ENDPOINT as string)
          : (process.env.NEXT_PUBLIC_PROD_WS_ENDPOINT as string),
      options: {
        reconnect: true,
        minTimeout: 10000,
        timeout: 30000,
        lazy: true,
      },
    })
  : null;

const terminalLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink as ApolloLink,
      httpLink
    )
  : httpLink;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: terminalLink,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState: any = null): ApolloClient<NormalizedCacheObject> | null {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null): ApolloClient<NormalizedCacheObject> | null {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
