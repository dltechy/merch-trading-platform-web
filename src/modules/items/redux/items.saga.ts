import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { CreateItemDto } from '../dtos/create-item.dto';
import { DeleteItemDto } from '../dtos/delete-item.dto';
import { GetItemsDto } from '../dtos/get-items.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { Item } from '../schemas/item';
import {
  createItemFailure,
  createItemRequest,
  createItemSuccess,
  deleteItemFailure,
  deleteItemRequest,
  deleteItemSuccess,
  getItemsFailure,
  getItemsRequest,
  getItemsSuccess,
  updateItemFailure,
  updateItemRequest,
  updateItemSuccess,
} from './items.slice';

const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const createItem = async ({
  name,
  description,
}: CreateItemDto): Promise<void> => {
  await axios.post<Item>(
    `${appHost}/items/create`,
    {
      name: name.trim(),
      description: description.trim(),
    },
    {
      withCredentials: true,
    },
  );
};

function* createItemSaga(
  action: PayloadAction<CreateItemDto>,
): Generator | PutEffect {
  try {
    yield call(createItem, action.payload);

    yield put(createItemSuccess());
  } catch (e) {
    yield put(createItemFailure(e as AxiosError));
  }
}

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

const updateItem = async ({
  id,
  description,
  ...dto
}: UpdateItemDto): Promise<void> => {
  const payload: Omit<UpdateItemDto, 'id'> = dto;
  if (description != null) {
    payload.description = description;
  }

  await axios.patch<void>(`${appHost}/items/${id}`, payload, {
    withCredentials: true,
  });
};

function* updateItemSaga(
  action: PayloadAction<UpdateItemDto>,
): Generator | PutEffect {
  try {
    yield call(updateItem, action.payload);

    yield put(updateItemSuccess());
  } catch (e) {
    yield put(updateItemFailure(e as AxiosError));
  }
}

const deleteItem = async ({ id }: DeleteItemDto): Promise<void> => {
  await axios.delete<void>(`${appHost}/items/${id}`, {
    withCredentials: true,
  });
};

function* deleteItemSaga(
  action: PayloadAction<DeleteItemDto>,
): Generator | PutEffect {
  try {
    yield call(deleteItem, action.payload);

    yield put(deleteItemSuccess());
  } catch (e) {
    yield put(deleteItemFailure(e as AxiosError));
  }
}

export function* itemsSaga(): Generator {
  yield all([
    takeLatest(createItemRequest.type, createItemSaga),
    takeLatest(getItemsRequest.type, getItemsSaga),
    takeLatest(updateItemRequest.type, updateItemSaga),
    takeLatest(deleteItemRequest.type, deleteItemSaga),
  ]);
}
