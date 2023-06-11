import '../../styles/globals.css';

import type { AppProps } from 'next/app';
import { FC } from 'react';
import { Provider } from 'react-redux';

import { wrapper } from '@app/redux/store';

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  );
};

export default App;
