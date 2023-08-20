import { FC, PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setTheme, Theme } from '@app/modules/common/redux/theme.slice';
import { AppState } from '@app/redux/store';

interface Props extends PropsWithChildren {
  className?: string;
}

export const ThemeWrapper: FC<Props> = ({ className = '', children }) => {
  // Properties

  const theme = useSelector((state: AppState) => state.theme.theme);

  const dispatch = useDispatch();

  // Effects & Callbacks

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      let userTheme: Theme;
      switch (storedTheme) {
        case 'dark':
          userTheme = Theme.Dark;
          break;
        case 'light':
          userTheme = Theme.Light;
          break;
        default:
          userTheme = Theme.Auto;
          break;
      }

      dispatch(setTheme(userTheme));
    }
  }, [dispatch]);

  // Elements

  return (
    <div
      className={`${((): string => {
        switch (theme) {
          case Theme.Dark:
            return 'theme-dark ';
          case Theme.Light:
            return 'theme-light ';
          default:
            return '';
        }
      })()}${className}`}
    >
      {children}
    </div>
  );
};
