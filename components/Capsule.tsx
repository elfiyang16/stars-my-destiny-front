import React from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_CAPSULE_BY_ID } from '../src/queries';

interface ICapsule {
  id: string;
}

export const Capsule: React.FC<ICapsule> = ({ id }) => {
  const { loading, error, data } = useQuery(GET_CAPSULE_BY_ID, {
    variables: { id },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  let capsule;
  if (data) {
    console.log(data);
    capsule = data.capsule;
  }
  return (
    <div>
      <h4> Return Capsule By {id} </h4>
      <div>
        <p>__typename: {capsule.__typename}</p>
        <p>Id: {capsule.id}</p>
        <p>Type: {capsule.type}</p>
        <p>Landings: {capsule.landings}</p>
        <p>Original_launch: {capsule.original_launch}</p>
        <p>Reuse_count: {capsule.reuse_count}</p>
        <p>Status: {capsule.status}</p>
        <div>
          Missions:
          {capsule.missions?.map((mission: any, index: number) => (
            <React.Fragment key={`mission-capsule-${index}`}>
              <p>{mission.__typename}</p>
              <p>{mission.name}</p>
              <p>{mission.flight}</p>
            </React.Fragment>
          ))}
        </div>
        <p>
          Dragon:
          {capsule.dragon!.id}
        </p>
      </div>
    </div>
  );
};
