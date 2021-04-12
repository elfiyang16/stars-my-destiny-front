import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_MISSIONS } from '../src/queries';
import { Mission } from '../src/generated/graphql';
import { Mission as GetMission } from './Mission';

export const Missions: React.FC = () => {
  const [id, setId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ALL_MISSIONS);
  console.log(data);

  const handleOnChange = (e: any) => setId(e.target.value);

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  let missions;

  if (data) {
    missions = data.missions;
  }

  return (
    <div>
      <h4> Get Mission By Id </h4>
      <label>Id: </label>
      <input onChange={handleOnChange} />
      <p>======================</p>
      {id && <GetMission id={id} />}
      <p>======================</p>
      <h4> All Missions </h4>
      {missions?.length > 0 &&
        missions.map((mission: Mission, index: number) => (
          <React.Fragment key={`${mission.id}-${index}`}>
            <p>**************</p>
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
            <p>===============</p>
          </React.Fragment>
        ))}
    </div>
  );
};
