import { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';
import { Item } from '@app/modules/items/schemas/item';

import { CreateUserWishDto } from '../dtos/create-user-wish.dto';
import { GetUserWishesDto } from '../dtos/get-user-wishes.dto';
import { UserWish } from '../schemas/user-wish';
import {
  createUserWishFailure,
  createUserWishRequest,
  createUserWishSuccess,
  getUserWishesFailure,
  getUserWishesRequest,
  getUserWishesSuccess,
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

export function* userWishesSaga(): Generator {
  yield all([
    takeLatest(createUserWishRequest.type, createUserWishSaga),
    takeLatest(getUserWishesRequest.type, getUserWishesSaga),
  ]);
}
