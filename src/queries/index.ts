import gql from 'graphql-tag';

export const GET_ALL_CAPSULES = gql(`
    query getAllCapsules {
    capsules {
        id
        landings
        original_launch
        reuse_count
        status
        type
        dragon{
        id
        }
        missions{
        flight
        name
        }
      }
    }
`);

export const GET_ALL_DRAGONS = gql(`
query getAllDragons {
  dragons {
    id
    name
    active
    crew_capacity
    description
    type
    diameter{
      meters
    }
    dry_mass_kg
    first_flight
    launch_payload_mass{
      kg
    }
    return_payload_mass{
      kg
    }
  }
}
`);

export const GET_ALL_MISSIONS = gql(`
query getAllMissions {
  missions {
    id
    name
    description
    manufacturers
    twitter
    website
  }
}
`);

export const GET_CAPSULE_BY_ID = gql(`
query getCapsuleById($id: ID!){
  capsule(id: $id){
    id
    landings
    original_launch
    reuse_count
    status
    type
    dragon{
     id
    }
   missions{
   flight
   name
   }
  }
}
`);

export const GET_MISSION_BY_ID = gql(`
query getMissionById($id: ID!){
  mission(id: $id){
    id
    name
    description
    manufacturers
    twitter
    website
  }
}
`);

export const GET_DRAGON_BY_ID = gql(`
query getDragonById($id: ID!){
  dragon(id: $id){
    id
    name
    active
    crew_capacity
    description
    type
    diameter{
      meters
    }
    dry_mass_kg
    first_flight
    launch_payload_mass{
      kg
    }
    return_payload_mass{
      kg
    }
  }
}
`);
