import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ToastType {
  Info,
  Error,
}

export interface ToastState {
  messages: {
    type: ToastType;
    message: string;
  }[];
}

const initialState: ToastState = {
  messages: [],
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToastMessage: (
      state: ToastState,
      action: PayloadAction<{
        type: ToastType;
        message: string;
      }>,
    ) => {
      return {
        messages: [...state.messages, action.payload],
      };
    },
    removeToastMessage: (state: ToastState, action: PayloadAction<number>) => {
      return {
        messages: [
          ...state.messages.slice(0, action.payload),
          ...state.messages.slice(action.payload + 1, state.messages.length),
        ],
      };
    },
    clearToastMessages: () => {
      return {
        messages: [],
      };
    },
  },
});

export const { addToastMessage, removeToastMessage, clearToastMessages } =
  toastSlice.actions;

export const toastReducer = toastSlice.reducer;
