import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

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
