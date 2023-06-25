import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';
import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';

import { CreateUserWishDto } from '../dtos/create-user-wish.dto';
import { DeleteUserWishDto } from '../dtos/delete-user-wish.dto';
import { GetUserWishesDto } from '../dtos/get-user-wishes.dto';
import { UpdateUserWishDto } from '../dtos/update-user-wish.dto';
import { UserWish } from '../schemas/user-wish';

export interface UserWishesState {
  totalCount: number;
  userWishes: UserWish[];
  createUserWish: ApiState;
  getUserWishes: ApiState;
  updateUserWish: ApiState;
  deleteUserWish: ApiState;
}

const initialState: UserWishesState = {
  totalCount: 0,
  userWishes: [],
  createUserWish: { ...initialApiState },
  getUserWishes: { ...initialApiState },
  updateUserWish: { ...initialApiState },
  deleteUserWish: { ...initialApiState },
};

export const userWishesSlice = createSlice({
  name: 'userWishes',
  initialState,
  reducers: {
    resetUserWishesState: (
      state: UserWishesState,
      action: PayloadAction<
        | {
            totalCount?: boolean;
            userWishes?: boolean;
            createUserWish?: boolean;
            getUserWishes?: boolean;
            updateUserWish?: boolean;
            deleteUserWish?: boolean;
          }
        | undefined
      >,
    ) => {
      if (!action.payload) {
        return initialState;
      }

      const newState = { ...state };
      if (action.payload.totalCount) {
        newState.totalCount = initialState.totalCount;
      }
      if (action.payload.userWishes) {
        newState.userWishes = initialState.userWishes;
      }
      if (action.payload.createUserWish) {
        newState.createUserWish = initialState.createUserWish;
      }
      if (action.payload.getUserWishes) {
        newState.getUserWishes = initialState.getUserWishes;
      }
      if (action.payload.updateUserWish) {
        newState.updateUserWish = initialState.updateUserWish;
      }
      if (action.payload.deleteUserWish) {
        newState.deleteUserWish = initialState.deleteUserWish;
      }
      return newState;
    },
    createUserWishRequest: (
      state: UserWishesState,
      _action: PayloadAction<{
        createItemDto?: CreateItemDto;
        createUserWishDto: CreateUserWishDto;
      }>,
    ) => {
      return {
        ...state,
        createUserWish: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    createUserWishSuccess: (state: UserWishesState) => {
      return {
        ...state,
        createUserWish: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    createUserWishFailure: (
      state: UserWishesState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        createUserWish: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    getUserWishesRequest: (
      state: UserWishesState,
      _action: PayloadAction<GetUserWishesDto>,
    ) => {
      return {
        ...state,
        getUserWishes: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    getUserWishesSuccess: (
      state: UserWishesState,
      action: PayloadAction<{
        totalCount: number;
        userWishes: UserWish[];
      }>,
    ) => {
      return {
        ...state,
        totalCount: action.payload.totalCount,
        userWishes: action.payload.userWishes,
        getUserWishes: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    getUserWishesFailure: (
      state: UserWishesState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        getUserWishes: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    updateUserWishRequest: (
      state: UserWishesState,
      _action: PayloadAction<UpdateUserWishDto>,
    ) => {
      return {
        ...state,
        updateUserWish: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    updateUserWishSuccess: (state: UserWishesState) => {
      return {
        ...state,
        updateUserWish: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    updateUserWishFailure: (
      state: UserWishesState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        updateUserWish: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    deleteUserWishRequest: (
      state: UserWishesState,
      _action: PayloadAction<DeleteUserWishDto>,
    ) => {
      return {
        ...state,
        deleteUserWish: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    deleteUserWishSuccess: (state: UserWishesState) => {
      return {
        ...state,
        deleteUserWish: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    deleteUserWishFailure: (
      state: UserWishesState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        deleteUserWish: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
  },
});

export const {
  resetUserWishesState,
  createUserWishRequest,
  createUserWishSuccess,
  createUserWishFailure,
  getUserWishesRequest,
  getUserWishesSuccess,
  getUserWishesFailure,
  updateUserWishRequest,
  updateUserWishSuccess,
  updateUserWishFailure,
  deleteUserWishRequest,
  deleteUserWishSuccess,
  deleteUserWishFailure,
} = userWishesSlice.actions;

export const userWishesReducer = userWishesSlice.reducer;
