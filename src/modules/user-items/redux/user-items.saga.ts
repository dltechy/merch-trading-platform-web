import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';
import { Item } from '@app/modules/items/schemas/item';

import { CreateUserItemDto } from '../dtos/create-user-item.dto';
import { DeleteUserItemDto } from '../dtos/delete-user-item.dto';
import { GetUserItemsDto } from '../dtos/get-user-items.dto';
import { UpdateUserItemDto } from '../dtos/update-user-item.dto';
import { UserItem } from '../schemas/user-item';
import {
  createUserItemFailure,
  createUserItemRequest,
  createUserItemSuccess,
  deleteUserItemFailure,
  deleteUserItemRequest,
  deleteUserItemSuccess,
  getUserItemsFailure,
  getUserItemsRequest,
  getUserItemsSuccess,
  updateUserItemFailure,
  updateUserItemRequest,
  updateUserItemSuccess,
} from './user-items.slice';

const appHost = process.env.NEXT_PUBLIC_APP_HOST;

const createItem = async ({
  name,
  description,
}: CreateItemDto): Promise<Item> => {
  const { data } = await axios.post<Item>(
    `${appHost}/items/create`,
    {
      name: name.trim(),
      description: description.trim(),
    },
    {
      withCredentials: true,
    },
  );

  return data;
};

const createUserItem = async ({
  remarks,
  ...dto
}: CreateUserItemDto): Promise<void> => {
  await axios.post<UserItem>(
    `${appHost}/user-items/create`,
    {
      ...dto,
      remarks: remarks.trim(),
    },
    {
      withCredentials: true,
    },
  );
};

function* createUserItemSaga(
  action: PayloadAction<{
    createItemDto?: CreateItemDto;
    createUserItemDto: CreateUserItemDto;
  }>,
): Generator | PutEffect {
  try {
    if (action.payload.createItemDto) {
      const item: Item = yield call(createItem, action.payload.createItemDto);
      action.payload.createUserItemDto = {
        ...action.payload.createUserItemDto,
        itemId: item.id,
      };
    }

    yield call(createUserItem, action.payload.createUserItemDto);

    yield put(createUserItemSuccess());
  } catch (e) {
    yield put(createUserItemFailure(e as AxiosError));
  }
}

const getUserItems = async (
  dto: GetUserItemsDto,
): Promise<{
  totalCount: number;
  userItems: UserItem[];
}> => {
  const { data } = await axios.get<{
    totalCount: number;
    userItems: UserItem[];
  }>(`${appHost}/user-items`, {
    params: dto,
  });

  return data;
};

function* getUserItemsSaga(
  action: PayloadAction<GetUserItemsDto>,
): Generator | PutEffect {
  try {
    const userItems: {
      totalCount: number;
      userItems: UserItem[];
    } = yield call(getUserItems, action.payload);

    yield put(getUserItemsSuccess(userItems));
  } catch (e) {
    yield put(getUserItemsFailure(e as AxiosError));
  }
}

const updateUserItem = async ({
  id,
  remarks,
  ...dto
}: UpdateUserItemDto): Promise<void> => {
  const payload: Omit<UpdateUserItemDto, 'id'> = dto;
  if (remarks != null) {
    payload.remarks = remarks;
  }

  await axios.patch<void>(`${appHost}/user-items/${id}`, payload, {
    withCredentials: true,
  });
};

function* updateUserItemSaga(
  action: PayloadAction<UpdateUserItemDto>,
): Generator | PutEffect {
  try {
    yield call(updateUserItem, action.payload);

    yield put(updateUserItemSuccess());
  } catch (e) {
    yield put(updateUserItemFailure(e as AxiosError));
  }
}

const deleteUserItem = async ({ id }: DeleteUserItemDto): Promise<void> => {
  await axios.delete<void>(`${appHost}/user-items/${id}`, {
    withCredentials: true,
  });
};

function* deleteUserItemSaga(
  action: PayloadAction<DeleteUserItemDto>,
): Generator | PutEffect {
  try {
    yield call(deleteUserItem, action.payload);

    yield put(deleteUserItemSuccess());
  } catch (e) {
    yield put(deleteUserItemFailure(e as AxiosError));
  }
}

export function* userItemsSaga(): Generator {
  yield all([
    takeLatest(createUserItemRequest.type, createUserItemSaga),
    takeLatest(getUserItemsRequest.type, getUserItemsSaga),
    takeLatest(updateUserItemRequest.type, updateUserItemSaga),
    takeLatest(deleteUserItemRequest.type, deleteUserItemSaga),
  ]);
}
