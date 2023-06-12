import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { User } from '@app/modules/users/schemas/user';

import { LoginDto } from '../dtos/login.dto';
import {
  checkLoginStateFailure,
  checkLoginStateRequest,
  checkLoginStateSuccess,
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutFailure,
  logoutRequest,
  logoutSuccess,
} from './auth.slice';

const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const login = async (dto: LoginDto): Promise<User> => {
  const { data } = await axios.post<User>(`${appHost}/auth/login`, dto, {
    withCredentials: true,
  });

  return data;
};

function* loginSaga(action: PayloadAction<LoginDto>): Generator | PutEffect {
  try {
    const user: User = yield call(login, action.payload);

    yield put(loginSuccess(user));
  } catch (e) {
    yield put(loginFailure(e as AxiosError));
  }
}

const logout = async (): Promise<void> => {
  await axios.post(`${appHost}/auth/logout`, undefined, {
    withCredentials: true,
  });
};

function* logoutSaga(): Generator | PutEffect {
  try {
    yield call(logout);

    yield put(logoutSuccess());
  } catch (e) {
    yield put(logoutFailure(e as AxiosError));
  }
}

const checkLoginState = async (): Promise<User> => {
  const { data } = await axios.get<User>(`${appHost}/auth/userinfo`, {
    withCredentials: true,
  });

  return data;
};

function* checkLoginStateSaga(): Generator | PutEffect {
  try {
    const user: User = yield call(checkLoginState);

    yield put(checkLoginStateSuccess(user));
  } catch (e) {
    yield put(checkLoginStateFailure(e as AxiosError));
  }
}

export function* authSaga(): Generator {
  yield all([
    takeLatest(loginRequest.type, loginSaga),
    takeLatest(logoutRequest.type, logoutSaga),
    takeLatest(checkLoginStateRequest.type, checkLoginStateSaga),
  ]);
}
