import '../../styles/globals.css';

import type { AppProps } from 'next/app';
import { FC } from 'react';
import { Provider } from 'react-redux';

import { ThemeWrapper } from '@app/modules/app/containers/ThemeWrapper';
import { Toast } from '@app/modules/common/containers/Toast';
import { Header } from '@app/modules/header/containers/Header';
import { wrapper } from '@app/redux/store';

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <ThemeWrapper className="flex h-screen w-screen flex-col bg-primary text-secondary">
        <Header />

        <Component {...props.pageProps} />
      </ThemeWrapper>

      <Toast />
    </Provider>
  );
};

export default App;
