import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { authReducer, AuthState } from '@app/modules/auth/redux/auth.slice';
import {
  toastReducer,
  ToastState,
} from '@app/modules/common/redux/toast.slice';
import { itemsReducer, ItemsState } from '@app/modules/items/redux/items.slice';
import {
  registrationReducer,
  RegistrationState,
} from '@app/modules/registration/redux/registration.slice';
import {
  userItemsReducer,
  UserItemsState,
} from '@app/modules/user-items/redux/user-items.slice';
import {
  userWishesReducer,
  UserWishesState,
} from '@app/modules/user-wishes/redux/user-wishes.slice';

import { rootSaga } from './root.saga';

const sagaMiddleware = createSagaMiddleware();

const makeStore = (): ToolkitStore<
  {
    toast: ToastState;
    auth: AuthState;
    registration: RegistrationState;
    items: ItemsState;
    userItems: UserItemsState;
    userWishes: UserWishesState;
  },
  AnyAction,
  SagaMiddleware<object>[]
> => {
  const store = configureStore({
    reducer: {
      toast: toastReducer,
      auth: authReducer,
      registration: registrationReducer,
      items: itemsReducer,
      userItems: userItemsReducer,
      userWishes: userWishesReducer,
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
