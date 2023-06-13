import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  ApiState,
  initialApiState,
} from '@app/modules/common/states/api-state';

import { RegisterDto } from '../dtos/register.dto';

export interface RegistrationState {
  register: ApiState;
}

const initialState: RegistrationState = {
  register: { ...initialApiState },
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    resetRegistrationState: () => {
      return initialState;
    },
    registerRequest: (
      _state: RegistrationState,
      _action: PayloadAction<RegisterDto>,
    ) => {
      return {
        register: {
          isTriggered: true,
          isLoading: true,
        },
      };
    },
    registerSuccess: () => {
      return {
        register: {
          isTriggered: true,
          isLoading: false,
        },
      };
    },
    registerFailure: (
      _state: RegistrationState,
      action: PayloadAction<AxiosError>,
    ) => {
      return {
        register: {
          isTriggered: true,
          isLoading: false,
          error: action.payload,
        },
      };
    },
  },
});

export const {
  resetRegistrationState,
  registerRequest,
  registerSuccess,
  registerFailure,
} = registrationSlice.actions;

export const registrationReducer = registrationSlice.reducer;
