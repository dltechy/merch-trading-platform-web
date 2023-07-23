import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import { User } from '@app/modules/users/schemas/user';
import { UserRole } from '@app/modules/users/schemas/user-role';

import { LoginDto } from '../dtos/login.dto';

export interface AuthState {
  user?: User;
  isAdmin: boolean;
  initializationState: InitializationState;
  login: ApiState;
  logout: ApiState;
  checkLoginState: ApiState;
}

const initialState: AuthState = {
  isAdmin: false,
  initializationState: InitializationState.Uninitialized,
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
            initializationState?: boolean;
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
        newState.isAdmin = initialState.isAdmin;
      }
      if (action.payload.initializationState) {
        newState.initializationState = initialState.initializationState;
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
        isAdmin: action.payload.roles.includes(UserRole.Admin),
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
        isAdmin: false,
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
        initializationState:
          state.initializationState === InitializationState.Uninitialized
            ? InitializationState.Initializing
            : state.initializationState,
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
        isAdmin: action.payload.roles.includes(UserRole.Admin),
        initializationState: InitializationState.Initialized,
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
        initializationState: InitializationState.Initialized,
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
