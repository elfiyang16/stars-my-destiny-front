import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from '../types/custom';
import { useMutation } from '@apollo/client';
import { INSERT_USER, IInsertUserInput, GET_ALL_USERS, IUpdateUserInputPartial, UPDATE_USER } from '../src/queries';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { getAllUserFilter } from './Users';

export const InsertUser: React.FC = () => {
  let userInput: IInsertUserInput;
  const [name, setName] = useState<string | undefined>(undefined);
  const [rocket, setRocket] = useState<string | undefined>(undefined);

  const [insertUser, { loading, error, data }] = useMutation(INSERT_USER, {
    context: { clientName: 'thirdParty' },
    update(cache, { data: { insert_users } }) {
      const insertedUser = insert_users.returning[0];
      const existingUsers = cache.readQuery({
        query: GET_ALL_USERS,
        variables: { getAllUserFilter },
      });
      if (existingUsers && insertedUser) {
        cache.writeQuery({
          query: GET_ALL_USERS,
          data: {
            users: [...(existingUsers as any)?.users, insertedUser],
          },
        });
      }
    },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  let user;
  if (data) {
    console.log(data);
    user = data.insert_users.returning[0];
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const id = uuidv4() as UUID;
          const timestamp = (new Date().toISOString() as unknown) as Date;
          userInput = { id, name, rocket, timestamp, twitter: null };
          insertUser({ variables: { objects: userInput } });
          setName(undefined);
          setRocket(undefined);
        }}
      >
        Name: <input type="name" name="name" onChange={(e: any) => setName(e.target.value)} />
        <br />
        Rocket: <input type="rocket" name="rocket" onChange={(e: any) => setRocket(e.target.value)} />
        <br />
        <button type="submit">Insert User</button>
      </form>
      <p>=================</p>
      <h4>Inserted User</h4>

      {user && (
        <div>
          <p>Id: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Rocket: {user.rocket}</p>
          <p>Create time: {user.timestamp}</p>
        </div>
      )}
    </div>
  );
};

export const UpdateUser: React.FC = () => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [rocket, setRocket] = useState<string | undefined>(undefined);
  const [id, setId] = useState<UUID | undefined>(undefined);

  const [updateUser, { loading, error, data }] = useMutation(UPDATE_USER, {
    context: { clientName: 'thirdParty' },
    // update(cache, { data: { insert_users } }) {
    //   const insertedUser = insert_users.returning[0];
    //   const existingUsers = cache.readQuery({
    //     query: GET_ALL_USERS,
    //     variables: { getAllUserFilter },
    //   });
    //   if (existingUsers && insertedUser) {
    //     cache.writeQuery({
    //       query: GET_ALL_USERS,
    //       data: {
    //         users: [...(existingUsers as any)?.users, insertedUser],
    //       },
    //     });
    //   }
    // },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  let user;
  if (data) {
    console.log(data);
    user = data.update_users.returning[0];
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!!id) {
            updateUser({
              variables: {
                _set: {
                  name: name,
                  rocket: rocket,
                } as IUpdateUserInputPartial,
                _eq: id,
              },
            });
          }
          setName(undefined);
          setRocket(undefined);
          setId(undefined);
        }}
      >
        Id to udpate: <input type="id" name="id" onChange={(e: any) => setId(e.target.value)} />
        <br />
        Name: <input type="name" name="name" onChange={(e: any) => setName(e.target.value)} />
        <br />
        Rocket: <input type="rocket" name="rocket" onChange={(e: any) => setRocket(e.target.value)} />
        <br />
        <button type="submit">Update User</button>
      </form>
      <p>=================</p>
      <h4>Updated User</h4>
      {user && (
        <div>
          <p>Id: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Rocket: {user.rocket}</p>
          <p>Create time: {user.timestamp}</p>
        </div>
      )}
    </div>
  );
};
