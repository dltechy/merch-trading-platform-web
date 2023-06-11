import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import {
  sampleReducer,
  SampleState,
} from '@app/modules/sample/redux/sample.slice';

import { rootSaga } from './root.saga';

const sagaMiddleware = createSagaMiddleware();

const makeStore = (): ToolkitStore<
  {
    sample: SampleState;
  },
  AnyAction,
  SagaMiddleware<object>[]
> => {
  const store = configureStore({
    reducer: {
      sample: sampleReducer,
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
