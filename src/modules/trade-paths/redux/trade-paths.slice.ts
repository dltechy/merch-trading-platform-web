import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';
import { UserItem } from '@app/modules/user-items/schemas/user-item';

import { FindTradePathsDto } from '../dtos/find-trade-paths.dto';

export interface TradePathsState {
  paths: UserItem[][];
  findTradePaths: ApiState;
}

const initialState: TradePathsState = {
  paths: [],
  findTradePaths: { ...initialApiState },
};

export const tradePathsSlice = createSlice({
  name: 'tradePaths',
  initialState,
  reducers: {
    resetTradePathsState: (
      state: TradePathsState,
      action: PayloadAction<
        | {
            paths?: boolean;
            findTradePaths?: boolean;
          }
        | undefined
      >,
    ) => {
      if (!action.payload) {
        return initialState;
      }

      const newState = { ...state };
      if (action.payload.paths) {
        newState.paths = initialState.paths;
      }
      if (action.payload.findTradePaths) {
        newState.findTradePaths = initialState.findTradePaths;
      }
      return newState;
    },
    findTradePathsRequest: (
      state: TradePathsState,
      _action: PayloadAction<FindTradePathsDto>,
    ) => {
      return {
        ...state,
        findTradePaths: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    findTradePathsSuccess: (
      _state: TradePathsState,
      action: PayloadAction<UserItem[][]>,
    ) => {
      return {
        paths: action.payload,
        findTradePaths: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    findTradePathsFailure: (
      state: TradePathsState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        findTradePaths: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
  },
});

export const {
  resetTradePathsState,
  findTradePathsRequest,
  findTradePathsSuccess,
  findTradePathsFailure,
} = tradePathsSlice.actions;

export const tradePathsReducer = tradePathsSlice.reducer;
