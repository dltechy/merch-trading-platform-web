import { createSlice } from '@reduxjs/toolkit';

export interface SampleState {
  isSample: boolean;
}

const initialState: SampleState = {
  isSample: true,
};

export const sampleSlice = createSlice({
  name: 'sample',
  initialState,
  reducers: {
    toggleSample: (state) => {
      state.isSample = !state.isSample;
    },
  },
});

export const { toggleSample } = sampleSlice.actions;

export const sampleReducer = sampleSlice.reducer;
