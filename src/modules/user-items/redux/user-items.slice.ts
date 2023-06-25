import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';
import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';

import { CreateUserItemDto } from '../dtos/create-user-item.dto';
import { DeleteUserItemDto } from '../dtos/delete-user-item.dto';
import { GetUserItemsDto } from '../dtos/get-user-items.dto';
import { UpdateUserItemDto } from '../dtos/update-user-item.dto';
import { UserItem } from '../schemas/user-item';

export interface UserItemsState {
  totalCount: number;
  userItems: UserItem[];
  createUserItem: ApiState;
  getUserItems: ApiState;
  updateUserItem: ApiState;
  deleteUserItem: ApiState;
}

const initialState: UserItemsState = {
  totalCount: 0,
  userItems: [],
  createUserItem: { ...initialApiState },
  getUserItems: { ...initialApiState },
  updateUserItem: { ...initialApiState },
  deleteUserItem: { ...initialApiState },
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
            updateUserItem?: boolean;
            deleteUserItem?: boolean;
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
      if (action.payload.updateUserItem) {
        newState.updateUserItem = initialState.updateUserItem;
      }
      if (action.payload.deleteUserItem) {
        newState.deleteUserItem = initialState.deleteUserItem;
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
        ...state,
        totalCount: action.payload.totalCount,
        userItems: action.payload.userItems,
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
    updateUserItemRequest: (
      state: UserItemsState,
      _action: PayloadAction<UpdateUserItemDto>,
    ) => {
      return {
        ...state,
        updateUserItem: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    updateUserItemSuccess: (state: UserItemsState) => {
      return {
        ...state,
        updateUserItem: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    updateUserItemFailure: (
      state: UserItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        updateUserItem: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    deleteUserItemRequest: (
      state: UserItemsState,
      _action: PayloadAction<DeleteUserItemDto>,
    ) => {
      return {
        ...state,
        deleteUserItem: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    deleteUserItemSuccess: (state: UserItemsState) => {
      return {
        ...state,
        deleteUserItem: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    deleteUserItemFailure: (
      state: UserItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        deleteUserItem: {
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
  updateUserItemRequest,
  updateUserItemSuccess,
  updateUserItemFailure,
  deleteUserItemRequest,
  deleteUserItemSuccess,
  deleteUserItemFailure,
} = userItemsSlice.actions;

export const userItemsReducer = userItemsSlice.reducer;
