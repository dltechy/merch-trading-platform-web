import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { GetItemsDto } from '../dtos/get-items.dto';
import { Item } from '../schemas/item';
import {
  getItemsFailure,
  getItemsRequest,
  getItemsSuccess,
} from './items.slice';

const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const getItems = async (
  dto: GetItemsDto,
): Promise<{
  totalCount: number;
  items: Item[];
}> => {
  const { data } = await axios.get<{
    totalCount: number;
    items: Item[];
  }>(`${appHost}/items`, {
    params: dto,
  });

  return data;
};

function* getItemsSaga(
  action: PayloadAction<GetItemsDto>,
): Generator | PutEffect {
  try {
    const items: {
      totalCount: number;
      items: Item[];
    } = yield call(getItems, action.payload);

    yield put(getItemsSuccess(items));
  } catch (e) {
    yield put(getItemsFailure(e as AxiosError));
  }
}

export function* itemsSaga(): Generator {
  yield all([takeLatest(getItemsRequest.type, getItemsSaga)]);
}
