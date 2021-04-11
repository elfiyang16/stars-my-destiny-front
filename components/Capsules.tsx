import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_CAPSULES } from '../src/queries';
import { Capsule } from '../src/generated/graphql';
import { Capsule as GetCapsule } from './Capsule';

export const Capsules: React.FC = () => {
  const [id, setId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ALL_CAPSULES);
  console.log(data);

  const handleOnChange = (e: any) => setId(e.target.value);

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  let capsules;

  if (data) {
    capsules = data.capsules;
  }

  return (
    <div>
      <h4> Get Capsule By Id </h4>
      <label>Id: </label>
      <input onChange={handleOnChange} />
      <p>======================</p>
      {id && <GetCapsule id={id} />}
      <p>======================</p>
      <h4> All Capsules </h4>

      {capsules?.length > 0 &&
        capsules.map((capsule: Capsule, index: number) => (
          <React.Fragment key={`${capsule.id}-${index}`}>
            <p>**************</p>
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
            <p>===============</p>
          </React.Fragment>
        ))}
    </div>
  );
};
