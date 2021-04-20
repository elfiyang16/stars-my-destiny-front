import { NextPage } from 'next';
import { InsertUser, UpdateUser } from '../components/User';
import { Users } from '../components/Users';
import { UsersOne } from '../components/UsersOne';

const UsersPage: NextPage = () => {
  return (
    <div>
      <InsertUser />
      <UpdateUser />
      <Users />
      {/* <h3>Users One</h3>
      <UsersOne /> */}
    </div>
  );
};

export default UsersPage;
