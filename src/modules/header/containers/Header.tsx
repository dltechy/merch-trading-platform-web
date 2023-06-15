import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  checkLoginStateRequest,
  logoutRequest,
  resetAuthState,
} from '@app/modules/auth/redux/auth.slice';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import { AppState } from '@app/redux/store';

import { HeaderTab } from '../components/HeaderTab';

export const Header: FC = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const { pathname } = useRouter();

  const [initializationState, setInitializationState] = useState(
    InitializationState.Uninitialized,
  );
  const [isRenderAllowed, setIsRenderAllowed] = useState(false);

  const user = useSelector((state: AppState) => state.auth.user);
  const isCheckLoginStateLoading = useSelector(
    (state: AppState) => state.auth.checkLoginState.isLoading,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    dispatch(checkLoginStateRequest());

    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkLoginStateRequest());
  }, [pathname, dispatch]);

  useEffect(() => {
    switch (initializationState) {
      case InitializationState.Uninitialized:
        if (isCheckLoginStateLoading) {
          setInitializationState(InitializationState.Initializing);
        }
        break;
      case InitializationState.Initializing:
        if (!isCheckLoginStateLoading) {
          setInitializationState(InitializationState.Initialized);
        }
        break;
      default:
        break;
    }
  }, [initializationState, isCheckLoginStateLoading]);

  useEffect(() => {
    if (initializationState !== InitializationState.Initialized) {
      return;
    }

    if (user) {
      setIsRenderAllowed(true);
    } else if (pathname.search(/^\/(login|register)(\/|\?|$)/) === -1) {
      setIsRenderAllowed(false);

      Router.push('/login');
    }
  }, [pathname, initializationState, user, dispatch]);

  // Handlers

  const handleLogout = (e: FormEvent): void => {
    e.preventDefault();

    dispatch(logoutRequest());
  };

  // Element

  return (
    <div className="flex h-16 w-full items-center bg-blue-600">
      <div className="flex h-full w-full flex-row items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-white drop-shadow-[2px_2px_rgba(0,0,0,1)]"
        >
          <div className="h-full w-full p-4">
            <span>{appName}</span>
          </div>
        </Link>

        {isRenderAllowed && (
          <>
            <div className="absolute left-1/2 flex h-16 -translate-x-1/2 space-x-[-2px]">
              <HeaderTab href="/" text="Placeholder" />
            </div>

            <div>
              <span className="mr-4 whitespace-nowrap font-semibold text-white">
                {user?.displayName ? `Hello, ${user.displayName}` : ''}
              </span>
              <input
                className="mr-4 cursor-pointer rounded-md bg-white px-3 py-2 font-semibold hover:bg-gray-200"
                type="submit"
                value="Logout"
                onClick={handleLogout}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
