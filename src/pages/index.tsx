import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  // Effects

  useEffect(() => {
    Router.push('/login');
  }, []);

  // Elements

  return (
    <div>
      <Head>
        <title>{`${appName}`}</title>
      </Head>
    </div>
  );
};

export default Home;
