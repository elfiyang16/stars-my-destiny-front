import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ActionLoader } from '../components/ActionLoader';
import { useEffect } from 'react';

const HomePage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dragons');
  });
  return (
    <div>
      <ActionLoader />
    </div>
  );
};

export default HomePage;
