import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';
import { Item } from '@app/modules/items/schemas/item';

import { CreateUserWishDto } from '../dtos/create-user-wish.dto';
import { DeleteUserWishDto } from '../dtos/delete-user-wish.dto';
import { GetUserWishesDto } from '../dtos/get-user-wishes.dto';
import { UpdateUserWishDto } from '../dtos/update-user-wish.dto';
import { UserWish } from '../schemas/user-wish';
import {
  createUserWishFailure,
  createUserWishRequest,
  createUserWishSuccess,
  deleteUserWishFailure,
  deleteUserWishRequest,
  deleteUserWishSuccess,
  getUserWishesFailure,
  getUserWishesRequest,
  getUserWishesSuccess,
  updateUserWishFailure,
  updateUserWishRequest,
  updateUserWishSuccess,
} from './user-wishes.slice';

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

const createUserWish = async ({
  remarks,
  ...dto
}: CreateUserWishDto): Promise<void> => {
  await axios.post<UserWish>(
    `${appHost}/user-wishes/create`,
    {
      ...dto,
      remarks: remarks.trim(),
    },
    {
      withCredentials: true,
    },
  );
};

function* createUserWishSaga(
  action: PayloadAction<{
    createItemDto?: CreateItemDto;
    createUserWishDto: CreateUserWishDto;
  }>,
): Generator | PutEffect {
  try {
    if (action.payload.createItemDto) {
      const item: Item = yield call(createItem, action.payload.createItemDto);
      action.payload.createUserWishDto = {
        ...action.payload.createUserWishDto,
        itemId: item.id,
      };
    }

    yield call(createUserWish, action.payload.createUserWishDto);

    yield put(createUserWishSuccess());
  } catch (e) {
    yield put(createUserWishFailure(e as AxiosError));
  }
}

const getUserWishes = async (
  dto: GetUserWishesDto,
): Promise<{
  totalCount: number;
  userWishes: UserWish[];
}> => {
  const { data } = await axios.get<{
    totalCount: number;
    userWishes: UserWish[];
  }>(`${appHost}/user-wishes`, {
    params: dto,
  });

  return data;
};

function* getUserWishesSaga(
  action: PayloadAction<GetUserWishesDto>,
): Generator | PutEffect {
  try {
    const userWishes: {
      totalCount: number;
      userWishes: UserWish[];
    } = yield call(getUserWishes, action.payload);

    yield put(getUserWishesSuccess(userWishes));
  } catch (e) {
    yield put(getUserWishesFailure(e as AxiosError));
  }
}

const updateUserWish = async ({
  id,
  remarks,
  ...dto
}: UpdateUserWishDto): Promise<void> => {
  const payload: Omit<UpdateUserWishDto, 'id'> = dto;
  if (remarks != null) {
    payload.remarks = remarks;
  }

  await axios.patch<void>(`${appHost}/user-wishes/${id}`, payload, {
    withCredentials: true,
  });
};

function* updateUserWishSaga(
  action: PayloadAction<UpdateUserWishDto>,
): Generator | PutEffect {
  try {
    yield call(updateUserWish, action.payload);

    yield put(updateUserWishSuccess());
  } catch (e) {
    yield put(updateUserWishFailure(e as AxiosError));
  }
}

const deleteUserWish = async ({ id }: DeleteUserWishDto): Promise<void> => {
  await axios.delete<void>(`${appHost}/user-wishes/${id}`, {
    withCredentials: true,
  });
};

function* deleteUserWishSaga(
  action: PayloadAction<DeleteUserWishDto>,
): Generator | PutEffect {
  try {
    yield call(deleteUserWish, action.payload);

    yield put(deleteUserWishSuccess());
  } catch (e) {
    yield put(deleteUserWishFailure(e as AxiosError));
  }
}

export function* userWishesSaga(): Generator {
  yield all([
    takeLatest(createUserWishRequest.type, createUserWishSaga),
    takeLatest(getUserWishesRequest.type, getUserWishesSaga),
    takeLatest(updateUserWishRequest.type, updateUserWishSaga),
    takeLatest(deleteUserWishRequest.type, deleteUserWishSaga),
  ]);
}
