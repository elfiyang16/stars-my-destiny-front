import { UUID } from '../../types/custom';
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

export const CORE_USER_FIELDS = gql(`
fragment CoreUserFields on users {
  id
  name
  rocket
  timestamp
}
`);

export const INSERT_USER = gql(`
mutation insertUser($objects: [users_insert_input!]!) {
  insert_users(objects:$objects
     ){
    returning{
      id
      name
      rocket
      timestamp
      twitter
    }
  }
}
`);

export const UPDATE_USER = gql(`
mutation updateUser($_set: users_set_input, $_eq:uuid){
  update_users(_set:$_set, where: {id: {_eq:$_eq}}) {
    returning {
      id
      name
      rocket
      timestamp
    }
  }
}
`);

export const GET_ALL_USERS = gql(`
 query getAllUsers($timestamp:order_by,$name: order_by, $limit: Int) {
  users(order_by: {timestamp: $timestamp, name: $name}, limit: $limit) {
    id
    name
    rocket
    timestamp
    twitter
  }
}
`);

export interface IInsertUserInput {
  id: UUID;
  name: string | undefined;
  rocket: string | undefined;
  timestamp: Date;
  twitter: string | null;
}

export type IUpdateUserInputPartial = Omit<IInsertUserInput, 'id' | 'timestamp' | 'twitter'>;

export interface IGetAllUserFilter {
  timestamp: UserOrderBy;
  name: UserOrderBy;
  limit: number | null;
}

export enum UserOrderBy {
  asc = 'asc',
  asc_nulls_first = 'asc_nulls_first',
  asc_nulls_last = 'asc_nulls_last',
  desc = 'desc',
  desc_nulls_first = 'desc_nulls_first',
  desc_nulls_last = 'desc_nulls_last',
}
