import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';
import { User } from '@app/modules/users/schemas/user';

import { LoginDto } from '../dtos/login.dto';

export interface AuthState {
  user?: User;
  login: ApiState;
  logout: ApiState;
  checkLoginState: ApiState;
}

const initialState: AuthState = {
  login: { ...initialApiState },
  logout: { ...initialApiState },
  checkLoginState: { ...initialApiState },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (
      state: AuthState,
      action: PayloadAction<
        | {
            user?: boolean;
            login?: boolean;
            logout?: boolean;
            checkLoginState?: boolean;
          }
        | undefined
      >,
    ) => {
      if (!action.payload) {
        return initialState;
      }

      const newState = { ...state };
      if (action.payload.user) {
        delete newState.user;
      }
      if (action.payload.login) {
        newState.login = initialState.login;
      }
      if (action.payload.logout) {
        newState.logout = initialState.logout;
      }
      if (action.payload.checkLoginState) {
        newState.checkLoginState = initialState.checkLoginState;
      }
      return newState;
    },
    loginRequest: (state: AuthState, _action: PayloadAction<LoginDto>) => {
      return {
        ...state,
        login: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    loginSuccess: (state: AuthState, action: PayloadAction<User>) => {
      return {
        ...state,
        user: action.payload,
        login: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    loginFailure: (state: AuthState, action: PayloadAction<AxiosError>) => {
      return {
        ...state,
        login: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    logoutRequest: (state: AuthState) => {
      return {
        ...state,
        logout: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    logoutSuccess: ({ user, ...state }: AuthState) => {
      return {
        ...state,
        login: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    logoutFailure: (state: AuthState, action: PayloadAction<AxiosError>) => {
      return {
        ...state,
        logout: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
    checkLoginStateRequest: (state: AuthState) => {
      return {
        ...state,
        checkLoginState: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    checkLoginStateSuccess: (state: AuthState, action: PayloadAction<User>) => {
      return {
        ...state,
        user: action.payload,
        checkLoginState: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    checkLoginStateFailure: (
      { user, ...state }: AuthState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        ...state,
        checkLoginState: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
  },
});

export const {
  resetAuthState,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  checkLoginStateRequest,
  checkLoginStateSuccess,
  checkLoginStateFailure,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
