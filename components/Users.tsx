import React, { useState } from 'react';
import { UUID } from '../types/custom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS, UserOrderBy, IGetAllUserFilter } from '../src/queries';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';

export interface IUser {
  id: UUID;
  name: string;
  timestamp: Date;
  rocket: string;
}

export const Users: React.FC = () => {
  const getAllUserFilter: IGetAllUserFilter = {
    order_by: {
      timestamp: UserOrderBy.asc,
      name: UserOrderBy.asc,
    },
    limit: null,
  };

  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    context: { clientName: 'thirdParty' },
    variables: { getAllUserFilter },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  let users;
  if (data) {
    console.log(data);
    users = data.users;
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
          </div>
        ))}
    </div>
  );
};
