import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from '../types/custom';
import { useMutation } from '@apollo/client';
import { INSERT_USER, IInsertUserInput } from '../src/queries';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';

export const InsertUser: React.FC = () => {
  let userInput: IInsertUserInput;
  const [name, setName] = useState<string | undefined>(undefined);
  const [rocket, setRocket] = useState<string | undefined>(undefined);

  //   const [id, setId] = useState<number | undefined>(undefined);
  //   const [quantity, setQuantity] = useState<number>(0);
  //   const [err, setErr] = useState<string>('');

  //   const handleCompletion = () => {
  //     setId(undefined);
  //     setQuantity(0);
  //     setErr('');
  //   };

  //   const handleError = () => {
  //     setErr('Something went wrong, please provide valid information to update');
  //   };
  //   const updateCache = (cache: any, { data: { updateProductQuantityById } }) => {
  //     const existingProducts = cache.readQuery({
  //       query: GET_ALL_PRODUCTS,
  //     });

  //     const updatedProducts = existingProducts!.allProducts.map((v: any) => {
  //       if (v.id === id) {
  //         return { ...v, ...updateProductQuantityById.quantity };
  //       } else {
  //         return v;
  //       }
  //     });
  //     cache.writeQuery({
  //       query: GET_ALL_PRODUCTS,
  //       data: { allProducts: updatedProducts },
  //     });
  //   };

  const [insertUser, { loading, error, data }] = useMutation(INSERT_USER, {
    context: { clientName: 'thirdParty' },
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
