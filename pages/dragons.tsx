import { NextPage } from 'next';
import { Dragons } from '../components/Dragons';
import Link from 'next/link';

const DragonsPage: NextPage = () => {
  return (
    <div>
      <Link href={'/capsules'}>
        <a>Capsules</a>
      </Link>
      <br />
      <Link href={'/missions'}>
        <a>Missions</a>
      </Link>
      <br />
      <Link href={'/users'}>
        <a>Users</a>
      </Link>
      <Dragons />
    </div>
  );
};

export default DragonsPage;
