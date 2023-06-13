import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { User } from '@app/modules/users/schemas/user';

import { RegisterDto } from '../dtos/register.dto';
import {
  registerFailure,
  registerRequest,
  registerSuccess,
} from './registration.slice';

const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const register = async (dto: RegisterDto): Promise<User> => {
  const { data } = await axios.post<User>(`${appHost}/users/create`, dto, {
    withCredentials: true,
  });

  return data;
};

function* registerSaga(
  action: PayloadAction<RegisterDto>,
): Generator | PutEffect {
  try {
    yield call(register, action.payload);

    yield put(registerSuccess());
  } catch (e) {
    yield put(registerFailure(e as AxiosError));
  }
}

export function* registrationSaga(): Generator {
  yield all([takeLatest(registerRequest.type, registerSaga)]);
}
