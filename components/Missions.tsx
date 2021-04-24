import React, { useState } from 'react';
import { useQuery, useApolloClient, ReactiveVar, NetworkStatus } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_MISSIONS } from '../src/queries';
import { Mission as ServerMissionType } from '../src/generated/graphql';
import { Mission as GetMission } from './Mission';
import { currentSelectedMissionIds } from '../src/services';

interface Mission extends ServerMissionType {
  isSelected: boolean;
}

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
  const { toggleMissionSelected } = useMissions(currentSelectedMissionIds);

  console.log(data);

  const handleOnChange = (e: any) => setId(e.target.value);
  const handleSelect = (e: any) => {
    toggleMissionSelected(e.target.value);
  };

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
            <label>Select: </label>
            Id: <input readOnly onClick={handleSelect} value={`${mission.id}`} />
            <p>Twitter: {mission.twitter}</p>
            {/* HERE only show the description if the mission is selected */}
            {mission.isSelected && <p>Description: {mission.description}</p>}
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

/*Extract the interaction logic away from the presentation layer and let container/controller handle the two */
const useMissions = (currentSelectedMissionIds: ReactiveVar<string[]>) => {
  const allSelectedMissionsIds = currentSelectedMissionIds();

  const toggleMissionSelected = (missionId: string) => {
    const found = !!allSelectedMissionsIds.find((id) => id === missionId);
    if (found) {
      currentSelectedMissionIds(allSelectedMissionsIds.filter((id) => id !== missionId));
    } else {
      currentSelectedMissionIds(allSelectedMissionsIds.concat(missionId));
    }
  };
  return { toggleMissionSelected };
};
