import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_DRAGONS } from '../src/queries';
import { Dragon } from '../src/generated/graphql';
import { Dragon as GetDragon } from './Dragon';

export const Dragons: React.FC = () => {
  const [id, setId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ALL_DRAGONS);
  console.log(data);

  const handleOnChange = (e: any) => setId(e.target.value);

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  let dragons;

  if (data) {
    dragons = data.dragons;
  }

  return (
    <div>
      <h4> Get Dragon By Id </h4>
      <label>Id: </label>
      <input onChange={handleOnChange} />
      <p>======================</p>
      {id && <GetDragon id={id} />}
      <p>======================</p>
      <h4> All Dragons </h4>
      {dragons?.length > 0 &&
        dragons.map((dragon: Dragon, index: number) => (
          <React.Fragment key={`${dragon.id}-${index}`}>
            <p>**************</p>
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
            <p>===============</p>
          </React.Fragment>
        ))}
    </div>
  );
};
