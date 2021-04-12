import React from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_MISSION_BY_ID } from '../src/queries';

interface IMission {
  id: string;
}

export const Mission: React.FC<IMission> = ({ id }) => {
  const { loading, error, data } = useQuery(GET_MISSION_BY_ID, {
    variables: { id },
  });

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  let mission;
  if (data) {
    console.log(data);
    mission = data.mission;
  }
  return (
    <div>
      <h4> Return Mission By {id} </h4>
      <div>
        <p>__typename: {mission.__typename}</p>
        <p>Name: {mission.name}</p>
        <p>Id: {mission.id}</p>
        <p>Twitter: {mission.twitter}</p>
        <p>Description: {mission.description}</p>
        <p>Website: {mission.website}</p>
        <div>
          Manufacturers:
          {mission.manufacturers?.map((manufacturer: any, index: number) => (
            <React.Fragment key={`manufacturer-mission-${index}`}>
              <p>{manufacturer}</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
