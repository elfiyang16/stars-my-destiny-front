import React, { useState } from 'react';
import { useQuery, useApolloClient, NetworkStatus } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_MISSIONS } from '../src/queries';
import { Mission } from '../src/generated/graphql';
import { Mission as GetMission } from './Mission';

export const Missions: React.FC = () => {
  const client = useApolloClient();

  const [id, setId] = useState<string | null>(null);
  const [complete, setComplete] = useState<boolean | null>(false);

  const { networkStatus, data, loading, error, refetch } = useQuery(GET_ALL_MISSIONS, {
    fetchPolicy: 'cache-and-network' /*default: cache-only */,
    nextFetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      data.missions && setComplete(true);
    },
    onError: (error) => console.error('Error creating a post', error),
    client: client,
  });
  console.log(data);

  const handleOnChange = (e: any) => setId(e.target.value);

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;
  if (networkStatus === NetworkStatus.refetch) console.log('Refetching!');

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
      <button onClick={() => refetch()}>Refetch!</button>
      {complete &&
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
