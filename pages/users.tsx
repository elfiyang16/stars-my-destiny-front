import { NextPage } from 'next';
import { InsertUser, UpdateUser } from '../components/User';
import { Users } from '../components/Users';
const UsersPage: NextPage = () => {
  return (
    <div>
      <InsertUser />
      <UpdateUser />
      <Users />
    </div>
  );
};

export default UsersPage;
