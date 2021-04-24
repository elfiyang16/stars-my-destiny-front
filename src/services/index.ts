import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  makeVar,
  split,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError, ErrorResponse } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';

const DEV_ENDPOINT = 'http://localhost:6688/graphql';
const DEV_WS_ENDPOINT = 'ws://localhost:6688/graphql';

export const currentSelectedMissionIds = makeVar<any[]>([]);

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

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

const thirdPartyLink = createHttpLink({
  uri: 'https://api.spacex.land/graphql/',
});

const spaceXLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink as ApolloLink,
      httpLink
    )
  : httpLink;

const terminalLink = split((op) => op.getContext().clientName === 'thirdParty', thirdPartyLink, spaceXLink);

const cache = new InMemoryCache({
  typePolicies: {
    Capsule: {
      keyFields: ['id', 'type'],
      fields: {
        landings: {
          read(landingTimes = 0) {
            // give it a default 0 :)
            return `${landingTimes} times`; /* field level middleware on client side */
          },
        },
        /* missions field return a CapsuleMission type which only has name + flight,
        but not id so let's create for this non-normalized object.

        Instead of blindly replacing the existing missions array with the incoming array, 
        below code concatenates the missions arrays, 
        while also checking for duplicate mission by checking its name field 
        merging the fields of any repeated mission objects.

        Alternativley, we can set up keyFields on Mission type separately.
        */
        missions: {
          /* function when write cache into missions field */
          merge(existing: any[], incoming: any[], { readField, mergeObjects }) {
            const merged: any[] = existing ? existing.slice(0) : []; // we return a copy of original array existing.slice(0)
            const missionNameToIndex: Record<string, number> = Object.create(null);
            if (existing) {
              existing.forEach((mission, index) => {
                missionNameToIndex[readField<string>('name', mission)!] = index; // e.g. {"CRS-8":1}
              });
            }
            incoming.forEach((mission) => {
              const name = readField<string>('name', mission);
              const index = missionNameToIndex[name!];
              //If it's number, then the index exists
              if (typeof index === 'number') {
                // merge mission as incoming value into merged[index] === existing
                merged[index] = mergeObjects(merged[index], mission);
              } else {
                //Else, the index is undefined for that mission name
                //Means it's first time we've seen this mission in this array.
                missionNameToIndex[name!] = merged.length; // assign the index to the name, which is the array length
                merged.push(mission);
              }
            });
            return merged;
          },
        },
      },
    },
    Dragon: {
      // it already has id field so it's fine to leave as it is
    },
    Mission: {
      fields: {
        isSelected: {
          read(_ = false, { readField }) {
            const missionId = readField('id');
            const isSelected = !!currentSelectedMissionIds().find((id) => id === missionId);
            return isSelected;
          },
        },
      },
    },
    users: {
      fields: {
        timestamp(timestamp) {
          return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
        },
      },
    },
    Query: {
      fields: {
        /* implement Cache-Redirect below,
        the same can be done for dragon & capsule:
        so whenever mission(id: xxx) gets queried, 
        the cache will go into missions cache and try find it
        */
        mission(_, { args, toReference }) {
          // return a reference that points to the mission entity
          // that was already created in the cache when the Missions list view query ran
          return toReference({
            __typename: 'Mission',
            id: args!.id,
          });
        },
        /* implement Relay style pagination
         */
        capsules: relayStylePagination(),
      },
    },
    /* COMMENT OUT BELOW AS 
    OTHERWISE the cache implememntation in User file is duplicated,
    but below is better
     */
    // Mutation: {
    //   fields: {
    //     insert_users: {
    //       /* whenever insert_users is about to write data to the cache (the merge function),
    //       instead of just returning the incoming data,
    //       we want to update the users query with that incoming data as well.
    //       Now we can call create mutations like update mutations
    //        */
    //       merge(_, incoming, { cache }) {
    //         cache.modify({
    //           fields: {
    //             users(existing = []) {
    //               return [...existing, incoming.returning[0]];
    //             },
    //           },
    //         });
    //         return incoming;
    //       },
    //     },
    //   },
    // },
  },
});
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, terminalLink]),
    cache: cache,
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
