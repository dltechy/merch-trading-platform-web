import { Head, Html, Main, NextScript } from 'next/document';
import { FC } from 'react';

const Document: FC = () => {
  const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION;
  const appBasePath = process.env.NEXT_PUBLIC_APP_BASE_PATH ?? '';

  return (
    <Html lang="en">
      <Head>
        <meta name="description" content={appDescription} />
        <link rel="icon" href={`${appBasePath}/images/favicon.ico`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
