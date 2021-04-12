import React from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_DRAGON_BY_ID } from '../src/queries';

interface IDragon {
  id: string;
}

export const Dragon: React.FC<IDragon> = ({ id }) => {
  const { loading, error, data } = useQuery(GET_DRAGON_BY_ID, {
    variables: { id },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  let dragon;
  if (data) {
    console.log(data);
    dragon = data.dragon;
  }
  return (
    <div>
      <h4> Return Dragon By {id} </h4>
      <div>
        <p>__typename: {dragon.__typename}</p>
        <p>Name: {dragon.name}</p>
        <p>Active: {dragon.active}</p>
        <p>Id: {dragon.id}</p>
        <p>Type: {dragon.type}</p>
        <p>Crew_capacity: {dragon.crew_capacity}</p>
        <p>First_flight: {dragon.first_flight}</p>
        <p>Dry_mass_kg: {dragon.dry_mass_kg}</p>
        <p>Launch_payload_mass: {dragon.launch_payload_mass!.kg}</p>
        <p>Return_payload_mass: {dragon.return_payload_mass!.kg}</p>
      </div>
    </div>
  );
};
