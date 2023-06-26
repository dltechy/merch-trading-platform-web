import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { UserItem } from '@app/modules/user-items/schemas/user-item';

import { FindTradePathsDto } from '../dtos/find-trade-paths.dto';
import {
  findTradePathsFailure,
  findTradePathsRequest,
  findTradePathsSuccess,
} from './trade-paths.slice';

const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const findTradePaths = async (
  dto: FindTradePathsDto,
): Promise<{
  paths: UserItem[][];
}> => {
  const { data } = await axios.post<{
    paths: UserItem[][];
  }>(`${appHost}/trade-paths/find`, dto, {
    withCredentials: true,
  });

  return data;
};

function* findTradePathsSaga(
  action: PayloadAction<FindTradePathsDto>,
): Generator | PutEffect {
  try {
    const {
      paths,
    }: {
      paths: UserItem[][];
    } = yield call(findTradePaths, action.payload);

    yield put(findTradePathsSuccess(paths));
  } catch (e) {
    yield put(findTradePathsFailure(e as AxiosError));
  }
}

export function* tradePathsSaga(): Generator {
  yield all([takeLatest(findTradePathsRequest.type, findTradePathsSaga)]);
}
