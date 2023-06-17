import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';

import { GetItemsDto } from '../dtos/get-items.dto';
import { Item } from '../schemas/item';

export interface ItemsState {
  totalCount: number;
  items: Item[];
  getItems: ApiState;
}

const initialState: ItemsState = {
  totalCount: 0,
  items: [],
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
      if (action.payload.getItems) {
        newState.getItems = initialState.getItems;
      }
      return newState;
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
      _state: ItemsState,
      action: PayloadAction<{
        totalCount: number;
        items: Item[];
      }>,
    ) => {
      return {
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
  },
});

export const {
  resetItemsState,
  getItemsRequest,
  getItemsSuccess,
  getItemsFailure,
} = itemsSlice.actions;

export const itemsReducer = itemsSlice.reducer;
