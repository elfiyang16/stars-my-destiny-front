import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from '../types/custom';
import { useMutation } from '@apollo/client';
import {
  INSERT_USER,
  IInsertUserInput,
  GET_ALL_USERS,
  CORE_USER_FIELDS,
  IUpdateUserInputPartial,
  UPDATE_USER,
} from '../src/queries';
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
      /**
       * what happens if the query has not yet been fetched,
       * so is not in your cache as you supposed?
       * proxy.readQuery would throw an error and the application would crash.
       */
      try {
        const existingUsers = cache.readQuery({
          query: GET_ALL_USERS,
          // note variable below must match the original query variables otherwise starts a new cache
          variables: {
            timestamp: getAllUserFilter.timestamp,
            name: getAllUserFilter.name,
            limit: getAllUserFilter.limit,
          },
        });
        if (existingUsers && insertedUser) {
          cache.writeQuery({
            query: GET_ALL_USERS,
            // note variable below must match the original query variables otherwise can't write into existingUsers
            variables: {
              timestamp: getAllUserFilter.timestamp,
              name: getAllUserFilter.name,
              limit: getAllUserFilter.limit,
            },
            data: {
              users: [...(existingUsers as any)?.users, insertedUser],
            },
          });
        }
      } catch (err) {
        console.log('Cache update user insert\n', err);
      }
      // more thorough approach comparing to above:
      // use of cache.modify to circumvent merge
      // write into fragment which is faster
      // safe check

      try {
        cache.modify({
          // id: cache.identify(insertedUser),
          fields: {
            users(existingUserRefs = [], { readField }) {
              const newUserRef = cache.writeFragment({
                data: insertedUser,
                // Fuck! also need variables here! which match the original ones for GET_PARTIAL_ALL_USERS in Users.tsx
                variables: { order_by: { name: 'asc', timestamp: 'asc' } },
                fragment: CORE_USER_FIELDS,
              });

              // safe check if the new user exist, we don't write again
              if (existingUserRefs.some((ref: any) => readField('id', ref) === insertedUser.id)) {
                return existingUserRefs;
              }

              return [...existingUserRefs, newUserRef];
            },
          },
        });
      } catch (err) {
        console.log('Cache update user insert fragment\n', err);
      }
    },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  let user;
  if (data) {
    user = data.insert_users.returning[0];
  }

  return (
    <div>
      <p>=================</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const id = uuidv4() as UUID;
          const timestamp = (new Date().toISOString() as unknown) as Date;
          userInput = { id, name, rocket, timestamp, twitter: null };
          insertUser({
            variables: { objects: userInput },
            optimisticResponse: {
              insert_users: {
                returning: {
                  id,
                  name,
                  rocket,
                  timestamp,
                  twitter: null,
                },
              },
            },
          });
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
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  let user;
  if (data) {
    user = data.update_users.returning[0];
  }

  return (
    <div>
      <p>=================</p>
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
