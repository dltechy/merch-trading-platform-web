import { FC, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import { Theme } from '@app/modules/common/redux/theme.slice';
import { AppState } from '@app/redux/store';

interface Props extends PropsWithChildren {
  className?: string;
}

export const ThemeWrapper: FC<Props> = ({ className = '', children }) => {
  const theme = useSelector((state: AppState) => state.theme.theme);

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
