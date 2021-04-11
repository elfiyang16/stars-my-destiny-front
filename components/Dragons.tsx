import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_DRAGONS } from '../src/queries';
import { Dragon } from '../src/generated/graphql';

export const Dragons: React.FC = () => {
  const [message, setMessage] = useState(null);
  const { data, loading, error } = useQuery(GET_ALL_DRAGONS);
  console.log(data);

  const router = useRouter();
  const timeoutId = useRef<number>();

  useEffect(() => {
    if (message) {
      timeoutId.current = window.setTimeout(function () {
        setMessage(null);
        router.push('/dragons');
      }, 3000);
    }
  }, [message]);

  if (loading) return <ActionLoader />;

  if (error) return <ErrorLoader />;

  let dragons;

  if (data) {
    dragons = data.dragons;
  }

  return (
    <div>
      {dragons?.length > 0 &&
        dragons.map((dragon: Dragon, index: number) => (
          <React.Fragment key={`${dragon.id}-${index}`}>
            <p>**************</p>

            <p>Name: {dragon.name}</p>
            <p>Active: {dragon.active}</p>
            <p>Id: {dragon.id}</p>
            <p>Type: {dragon.type}</p>
            <p>Crew_capacity: {dragon.crew_capacity}</p>
            <p>First_flight: {dragon.first_flight}</p>
            <p>Dry_mass_kg: {dragon.dry_mass_kg}</p>
            <p>Launch_payload_mass: {dragon.launch_payload_mass!.kg}</p>
            <p>Return_payload_mass: {dragon.return_payload_mass!.kg}</p>
            <p>__typename: {dragon.__typename}</p>
            <p>===============</p>
          </React.Fragment>
        ))}
    </div>
  );
};
