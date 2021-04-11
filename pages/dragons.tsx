import { NextPage } from 'next';
import { Dragons } from '../components/Dragons';
import Link from 'next/link';

const DragonsPage: NextPage = () => {
  return (
    <div>
      <Link href={'/capsules'}>
        <a>Capsules</a>
      </Link>
      <Dragons />
    </div>
  );
};

export default DragonsPage;
