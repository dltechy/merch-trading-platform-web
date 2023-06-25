import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';

import { CreateItemDto } from '../dtos/create-item.dto';
import { DeleteItemDto } from '../dtos/delete-item.dto';
import { GetItemsDto } from '../dtos/get-items.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { Item } from '../schemas/item';

export interface ItemsState {
  totalCount: number;
  items: Item[];
  createItem: ApiState;
  getItems: ApiState;
  updateItem: ApiState;
  deleteItem: ApiState;
}

const initialState: ItemsState = {
  totalCount: 0,
  items: [],
  createItem: { ...initialApiState },
  getItems: { ...initialApiState },
  updateItem: { ...initialApiState },
  deleteItem: { ...initialApiState },
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    resetItemsState: (
      state: ItemsState,
      action: PayloadAction<
        | {
            totalCount?: boolean;
            items?: boolean;
            createItem?: boolean;
            getItems?: boolean;
            updateItem?: boolean;
            deleteItem?: boolean;
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
      if (action.payload.items) {
        newState.items = initialState.items;
      }
      if (action.payload.createItem) {
        newState.createItem = initialState.createItem;
      }
      if (action.payload.getItems) {
        newState.getItems = initialState.getItems;
      }
      if (action.payload.updateItem) {
        newState.updateItem = initialState.updateItem;
      }
      if (action.payload.deleteItem) {
        newState.deleteItem = initialState.deleteItem;
      }
      return newState;
    },
    createItemRequest: (
      state: ItemsState,
      _action: PayloadAction<CreateItemDto>,
    ) => {
      return {
        ...state,
        createItem: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    createItemSuccess: (state: ItemsState) => {
      return {
        ...state,
        createItem: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    createItemFailure: (
      state: ItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        createItem: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    getItemsRequest: (
      state: ItemsState,
      _action: PayloadAction<GetItemsDto>,
    ) => {
      return {
        ...state,
        getItems: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    getItemsSuccess: (
      state: ItemsState,
      action: PayloadAction<{
        totalCount: number;
        items: Item[];
      }>,
    ) => {
      return {
        ...state,
        totalCount: action.payload.totalCount,
        items: action.payload.items,
        getItems: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    getItemsFailure: (state: ItemsState, action: PayloadAction<AxiosError>) => {
      return {
        ...state,
        getItems: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    updateItemRequest: (
      state: ItemsState,
      _action: PayloadAction<UpdateItemDto>,
    ) => {
      return {
        ...state,
        updateItem: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    updateItemSuccess: (state: ItemsState) => {
      return {
        ...state,
        updateItem: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    updateItemFailure: (
      state: ItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        updateItem: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    deleteItemRequest: (
      state: ItemsState,
      _action: PayloadAction<DeleteItemDto>,
    ) => {
      return {
        ...state,
        deleteItem: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    deleteItemSuccess: (state: ItemsState) => {
      return {
        ...state,
        deleteItem: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    deleteItemFailure: (
      state: ItemsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        deleteItem: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
  },
});

export const {
  resetItemsState,
  createItemRequest,
  createItemSuccess,
  createItemFailure,
  getItemsRequest,
  getItemsSuccess,
  getItemsFailure,
  updateItemRequest,
  updateItemSuccess,
  updateItemFailure,
  deleteItemRequest,
  deleteItemSuccess,
  deleteItemFailure,
} = itemsSlice.actions;

export const itemsReducer = itemsSlice.reducer;
