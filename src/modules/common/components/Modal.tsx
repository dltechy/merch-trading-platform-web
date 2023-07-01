import FocusTrap from 'focus-trap-react';
import { FC, PropsWithChildren, useEffect } from 'react';

import { FormCard } from './FormCard';

interface Props extends PropsWithChildren {
  title: string;
  onClickOutside?: () => void;
  onPressEscape?: () => void;
}

export const Modal: FC<Props> = ({
  title,
  children,
  onClickOutside,
  onPressEscape,
}) => {
  // Effects

  useEffect(() => {
    if (!onPressEscape) {
      return (): void => {
        // Do nothing
      };
    }

    const escapeListener = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') {
        return;
      }

      onPressEscape();
    };

    document.addEventListener('keydown', escapeListener);

    return (): void => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, [onPressEscape]);

  // Handlers

  const handleClickOutside = (): void => {
    onClickOutside?.();
  };

  // Elements

  return (
    <FocusTrap
      focusTrapOptions={{
        escapeDeactivates: false,
      }}
    >
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div
          className="absolute -z-10 h-full w-full bg-[rgba(0,0,0,0.5)]"
          role="presentation"
          onClick={handleClickOutside}
        />
        <FormCard title={title} className="flex max-h-full w-1/2 flex-col">
          {children}
        </FormCard>
      </div>
    </FocusTrap>
  );
};
