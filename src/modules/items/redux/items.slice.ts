import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';

import { CreateItemDto } from '../dtos/create-item.dto';
import { GetItemsDto } from '../dtos/get-items.dto';
import { Item } from '../schemas/item';

export interface ItemsState {
  totalCount: number;
  items: Item[];
  createItem: ApiState;
  getItems: ApiState;
}

const initialState: ItemsState = {
  totalCount: 0,
  items: [],
  createItem: { ...initialApiState },
  getItems: { ...initialApiState },
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
        totalCount: action.payload.totalCount,
        items: action.payload.items,
        createItem: state.createItem,
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
} = itemsSlice.actions;

export const itemsReducer = itemsSlice.reducer;
