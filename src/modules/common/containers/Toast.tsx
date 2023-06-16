import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { sleep } from '@app/helpers/timers/sleep.helper';
import { AppState } from '@app/redux/store';

import { removeToastMessage, ToastType } from '../redux/toast.slice';

enum Visibility {
  Visible,
  Hiding,
  Hidden,
}

export const Toast: FC = () => {
  // Properties

  const [toastType, setToastType] = useState(ToastType.Info);
  const [message, setMessage] = useState('');
  const [visibility, setVisibility] = useState(Visibility.Hidden);

  const messages = useSelector((state: AppState) => state.toast.messages);

  const dispatch = useDispatch();

  const sleepCancellationToken: { cancel?: () => void } = useMemo(() => {
    return {};
  }, []);

  // Effects

  useEffect(() => {
    (async (): Promise<void> => {
      if (visibility !== Visibility.Hidden || messages.length === 0) {
        return;
      }
      setToastType(messages[0].type);
      setMessage(messages[0].message);
      setVisibility(Visibility.Visible);

      await sleep(3000, sleepCancellationToken);
      setVisibility(Visibility.Hiding);

      await sleep(500, sleepCancellationToken);
      dispatch(removeToastMessage(0));
      setVisibility(Visibility.Hidden);
    })();
  }, [messages, visibility, dispatch, sleepCancellationToken]);

  // Handlers

  const handleClose = (): void => {
    if (visibility !== Visibility.Visible) {
      return;
    }

    sleepCancellationToken.cancel?.();
  };

  // Elements

  return (
    <div
      className={`fixed left-full top-24 float-right flex h-14 min-w-[12rem] flex-nowrap items-center justify-between space-x-4 whitespace-nowrap rounded-xl border-2 p-4 font-semibold transition-transform ${
        visibility === Visibility.Hidden ? 'invisible' : 'visible'
      } ${
        visibility === Visibility.Visible
          ? 'translate-x-[calc(-100%-2rem)]'
          : ''
      } ${
        toastType === ToastType.Info
          ? 'border-blue-500 bg-blue-300'
          : ' border-red-500 bg-red-300'
      }`}
    >
      <span>{message}</span>
      <input
        className="cursor-pointer rounded-md bg-white px-2 hover:bg-gray-200"
        type="button"
        value="X"
        onClick={handleClose}
      />
    </div>
  );
};
