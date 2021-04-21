import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ActionLoader } from './ActionLoader';
import { ErrorLoader } from './ErrorLoader';
import { GET_ALL_CAPSULES } from '../src/queries';
import { Capsule } from '../src/generated/graphql';
import { Capsule as GetCapsule } from './Capsule';

interface ICapsuleNode {
  node: Capsule;
}

export const Capsules: React.FC = () => {
  let capsules: {
    node: Capsule;
  };
  const [id, setId] = useState<string | null>(null);
  const first = 3; // fetch 3 rows every request

  const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_ALL_CAPSULES, {
    variables: { first },
    notifyOnNetworkStatusChange: true,
  });
  console.log(data);

  const hasNextPage = data && data.capsules.pageInfo.hasNextPage;
  const isRefetching = networkStatus === 3; //fetchMore

  const handleOnChange = (e: any) => setId(e.target.value);

  if (loading) return <ActionLoader />;
  if (error) return <ErrorLoader />;

  if (data) {
    capsules = data?.capsules.edges;
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
      <CapsulesList capsules={capsules} />
      {hasNextPage && (
        <button
          disabled={isRefetching}
          onClick={() => {
            fetchMore({
              variables: {
                first,
                after: data.capsules.pageInfo.endCursor, // cursor position
              },
            });
          }}
        >
          load more
        </button>
      )}
    </div>
  );
};

const CapsulesList: React.FC<{ capsules: ICapsuleNode[] }> = ({ capsules }) => {
  return (
    <>
      {capsules &&
        capsules?.length > 0 &&
        capsules.map((capsule, index: number) => (
          <React.Fragment key={`${capsule.node.id}-${index}`}>
            <p>**************</p>
            <p>__typename: {capsule.node.__typename}</p>
            <p>Id: {capsule.node.id}</p>
            <p>Type: {capsule.node.type}</p>
            <p>Landings: {capsule.node.landings}</p>
            <p>Original_launch: {capsule.node.original_launch}</p>
            <p>Reuse_count: {capsule.node.reuse_count}</p>
            <p>Status: {capsule.node.status}</p>
            <p>
              Dragon:
              {capsule.node.dragon!.id}
            </p>
            <div>
              Missions:
              {capsule.node.missions?.map((mission: any, index: number) => (
                <React.Fragment key={`mission-capsule-${index}`}>
                  <p>{mission.__typename}</p>
                  <p>{mission.name}</p>
                  <p>{mission.flight}</p>
                </React.Fragment>
              ))}
            </div>
            <p>===============</p>
          </React.Fragment>
        ))}
    </>
  );
};
