import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';
import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';

import { CreateUserItemDto } from '../dtos/create-user-item.dto';
import { GetUserItemsDto } from '../dtos/get-user-items.dto';
import { UserItem } from '../schemas/user-item';

export interface UserItemsState {
  totalCount: number;
  userItems: UserItem[];
  createUserItem: ApiState;
  getUserItems: ApiState;
}

const initialState: UserItemsState = {
  totalCount: 0,
  userItems: [],
  createUserItem: { ...initialApiState },
  getUserItems: { ...initialApiState },
};

export const userItemsSlice = createSlice({
  name: 'userItems',
  initialState,
  reducers: {
    resetUserItemsState: (
      state: UserItemsState,
      action: PayloadAction<
        | {
            totalCount?: boolean;
            userItems?: boolean;
            createUserItem?: boolean;
            getUserItems?: boolean;
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
      if (action.payload.userItems) {
        newState.userItems = initialState.userItems;
      }
      if (action.payload.createUserItem) {
        newState.createUserItem = initialState.createUserItem;
      }
      if (action.payload.getUserItems) {
        newState.getUserItems = initialState.getUserItems;
      }
      return newState;
    },
    createUserItemRequest: (
      state: UserItemsState,
      _action: PayloadAction<{
        createItemDto?: CreateItemDto;
        createUserItemDto: CreateUserItemDto;
      }>,
    ) => {
      return {
        ...state,
        createUserItem: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    createUserItemSuccess: (state: UserItemsState) => {
      return {
        ...state,
        createUserItem: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    createUserItemFailure: (
      state: UserItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        createUserItem: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    getUserItemsRequest: (
      state: UserItemsState,
      _action: PayloadAction<GetUserItemsDto>,
    ) => {
      return {
        ...state,
        getUserItems: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    getUserItemsSuccess: (
      state: UserItemsState,
      action: PayloadAction<{
        totalCount: number;
        userItems: UserItem[];
      }>,
    ) => {
      return {
        totalCount: action.payload.totalCount,
        userItems: action.payload.userItems,
        createUserItem: state.createUserItem,
        getUserItems: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    getUserItemsFailure: (
      state: UserItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        getUserItems: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
  },
});

export const {
  resetUserItemsState,
  createUserItemRequest,
  createUserItemSuccess,
  createUserItemFailure,
  getUserItemsRequest,
  getUserItemsSuccess,
  getUserItemsFailure,
} = userItemsSlice.actions;

export const userItemsReducer = userItemsSlice.reducer;
