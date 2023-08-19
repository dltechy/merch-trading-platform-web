import { createSlice } from '@reduxjs/toolkit';

export enum Theme {
  Auto,
  Light,
  Dark,
}

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: Theme.Auto,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state: ThemeState) => {
      let theme: Theme;
      switch (state.theme) {
        case Theme.Auto:
          theme = Theme.Dark;
          break;
        case Theme.Dark:
          theme = Theme.Light;
          break;
        case Theme.Light:
          theme = Theme.Auto;
          break;
        default:
          theme = Theme.Auto;
          break;
      }

      return {
        theme,
      };
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
