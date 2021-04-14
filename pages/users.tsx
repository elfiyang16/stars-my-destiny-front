import { NextPage } from 'next';
import { InsertUser } from '../components/User';
import { Users } from '../components/Users';
const UsersPage: NextPage = () => {
  return (
    <div>
      <InsertUser />
      <Users />
    </div>
  );
};

export default UsersPage;
