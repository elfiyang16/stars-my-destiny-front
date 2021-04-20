import React, { useEffect, useState } from 'react';
import { UUID } from '../types/custom';
import { ApolloConsumer, ApolloClient } from '@apollo/client';
import { GET_ALL_USERS, UserOrderBy, IGetAllUserFilter } from '../src/queries';
import { ErrorLoader } from './ErrorLoader';

export interface IUser {
  id: UUID;
  name: string;
  timestamp: Date;
  rocket: string;
  twitter: string;
  __typename?: string;
}

export const getAllUserFilter: IGetAllUserFilter = {
  timestamp: UserOrderBy.desc,
  name: UserOrderBy.asc,
  limit: null,
};

export const UsersOne: React.FC = () => {
  return <ApolloConsumer>{(client) => <UsersOneImplementation client={client} />}</ApolloConsumer>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const UsersOneImplementation: React.FC<{ client: ApolloClient<object> }> = ({ client }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const resSubscription = client
      .watchQuery({
        query: GET_ALL_USERS,
        context: { clientName: 'thirdParty' },
        fetchPolicy: 'cache-and-network',
        returnPartialData: true,
        variables: {
          timestamp: getAllUserFilter.timestamp,
          name: getAllUserFilter.name,
          limit: getAllUserFilter.limit,
        },
      })
      .subscribe({
        next: ({ data }) => {
          setUsers(data.users);
          console.log('USERSONE\n', data);
        },
        error: (e) => {
          console.log(e);
          return <ErrorLoader />;
        },
      });

    /* currently comment out clean up below otherwise encounters
    Error: Observable cancelled prematurely:
    https://github.com/apollographql/apollo-client/issues/7608
    */

    // return () => {
    //   resSubscription.unsubscribe();
    // };
  });

  return (
    <div>
      <p>=================</p>
      <h4>All Users</h4>
      {users &&
        users.length > 0 &&
        users.map((user: IUser, index: number) => (
          <div key={`${user.id}-${index}`}>
            <p>Id: {user.id}</p>
            <p>
              <b>Name: {user.name}</b>
            </p>
            <p>Rocket: {user.rocket}</p>
            <p>Create time: {user.timestamp}</p>
            <p>Twitter: {user.twitter}</p>
          </div>
        ))}
    </div>
  );
};
