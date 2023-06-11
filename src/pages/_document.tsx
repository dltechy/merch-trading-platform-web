import { Head, Html, Main, NextScript } from 'next/document';
import { FC } from 'react';

const Document: FC = () => {
  const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION;

  return (
    <Html lang="en">
      <Head>
        <meta name="description" content={appDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
