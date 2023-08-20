import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setTheme: (_state: ThemeState, action: PayloadAction<Theme>) => {
      return {
        theme: action.payload,
      };
    },
    toggleTheme: (state: ThemeState) => {
      let theme: Theme;
      switch (state.theme) {
        case Theme.Auto:
          theme = Theme.Dark;
          localStorage.setItem('theme', 'dark');
          break;
        case Theme.Dark:
          theme = Theme.Light;
          localStorage.setItem('theme', 'light');
          break;
        case Theme.Light:
          theme = Theme.Auto;
          localStorage.removeItem('theme');
          break;
        default:
          theme = Theme.Auto;
          localStorage.removeItem('theme');
          break;
      }

      return {
        theme,
      };
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
