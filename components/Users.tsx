import React, { useState } from 'react';
import { UUID } from '../types/custom';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS, UserOrderBy, IGetAllUserFilter, CORE_USER_FIELDS } from '../src/queries';
import { ActionLoader } from './ActionLoader';
import { gql } from 'graphql-tag';
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

/* default param order_by, limit */
export const GET_PARTIAL_ALL_USERS = gql`
  ${CORE_USER_FIELDS}
  query getPartialAllUsers($timestamp: order_by = asc, $name: order_by = asc, $limit: Int = 3) {
    users(order_by: { timestamp: $timestamp, name: $name }, limit: $limit) {
      ...CoreUserFields
    }
  }
`;

const queryMultiple = () => {
  const res = useQuery(GET_ALL_USERS, {
    context: { clientName: 'thirdParty' },
    variables: { timestamp: getAllUserFilter.timestamp, name: getAllUserFilter.name, limit: getAllUserFilter.limit },
  });
  const res2 = useQuery(GET_PARTIAL_ALL_USERS, {
    context: { clientName: 'thirdParty' },
  });
  return [res, res2];
};

export const Users: React.FC = () => {
  const [res, res2] = queryMultiple();
  const { data, error, loading } = res;
  const { loading: loadingPartial, error: errorPartial, data: dataPartial } = res2;

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  let users;
  if (data) {
    console.log(data);
    users = data.users;
  }

  if (loadingPartial) return <ActionLoader />;
  if (errorPartial) return <ErrorLoader />;
  let usersPartial;
  if (dataPartial) {
    console.log(dataPartial);
    usersPartial = dataPartial.users;
  }

  return (
    <div>
      <p>=================</p>
      <h4>All Users</h4>
      {users &&
        users.length > 0 &&
        users.map((user: IUser, index: number) => (
          <div key={`${user.id}-${index}`}>
            <p>Id: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Rocket: {user.rocket}</p>
            <p>Create time: {user.timestamp}</p>
            <p>Twitter: {user.twitter}</p>
          </div>
        ))}
      <p>=================</p>
      <h4>Fragmented Users</h4>
      {usersPartial &&
        usersPartial.length > 0 &&
        usersPartial.map((user: IUser, index: number) => (
          <div key={`${user.id}-${index}`}>
            <p>Id: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Rocket: {user.rocket}</p>
            <p>Create time: {user.timestamp}</p>
            <p>Typename: {user.__typename}</p>
          </div>
        ))}
    </div>
  );
};
