import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { authReducer, AuthState } from '@app/modules/auth/redux/auth.slice';

import { rootSaga } from './root.saga';

const sagaMiddleware = createSagaMiddleware();

const makeStore = (): ToolkitStore<
  {
    auth: AuthState;
  },
  AnyAction,
  SagaMiddleware<object>[]
> => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({ thunk: false }),
      sagaMiddleware,
    ],
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export const wrapper = createWrapper<AppStore>(makeStore);
