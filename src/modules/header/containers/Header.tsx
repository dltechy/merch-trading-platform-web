import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  checkLoginStateRequest,
  logoutRequest,
  resetAuthState,
} from '@app/modules/auth/redux/auth.slice';
import { ImageButton } from '@app/modules/common/components/ImageButton';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import { AppState } from '@app/redux/store';

import MenuSvg from '@public/images/menu.svg';

import { HeaderTab } from '../components/HeaderTab';
import { SidebarTab } from '../components/SidebarTab';

export const Header: FC = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const publicPagesRegex = useMemo(
    () => /^\/(login|register|items)(\/|\?|$)/,
    [],
  );

  const { pathname } = useRouter();

  const [initializationState, setInitializationState] = useState(
    InitializationState.Uninitialized,
  );
  const [isRenderAllowed, setIsRenderAllowed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector((state: AppState) => state.auth.user);
  const isLogoutTriggered = useSelector(
    (state: AppState) => state.auth.logout.isTriggered,
  );
  const isCheckLoginStateLoading = useSelector(
    (state: AppState) => state.auth.checkLoginState.isLoading,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    if (pathname.search(/^(\/\?|\/$|\?|$)/) !== -1) {
      Router.replace('/items');
    }
  }, [pathname]);

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
    } else if (isLogoutTriggered) {
      dispatch(
        addToastMessage({
          type: ToastType.Info,
          message: 'Logout successful',
        }),
      );
      dispatch(resetAuthState({ logout: true }));

      setIsRenderAllowed(false);

      if (pathname.search(publicPagesRegex) === -1) {
        Router.push('/login');
      }
    } else if (pathname.search(publicPagesRegex) === -1) {
      setIsRenderAllowed(false);

      Router.push('/login');
    }
  }, [
    publicPagesRegex,
    pathname,
    initializationState,
    user,
    isLogoutTriggered,
    dispatch,
  ]);

  // Handlers

  const handleLogin = (): void => {
    setIsSidebarOpen(false);

    Router.push('/login');
  };

  const handleLogout = (): void => {
    setIsSidebarOpen(false);

    dispatch(logoutRequest());
  };

  const handleOpenMenu = (): void => {
    setIsSidebarOpen(true);
  };

  const handleCloseMenu = (): void => {
    setIsSidebarOpen(false);
  };

  // Element

  return (
    <>
      <div className="flex h-16 w-full items-center bg-blue-600">
        <div className="flex h-full w-full flex-row items-center justify-between">
          <div className="flex items-center">
            <ImageButton
              SvgImage={MenuSvg}
              className="ml-2 aspect-square h-10 rounded-full fill-white p-2 hover:bg-blue-400 hover:fill-black xl:hidden"
              title="Menu"
              onClick={handleOpenMenu}
            />
            <Link
              href="/"
              className="text-2xl font-bold text-white drop-shadow-[2px_2px_rgba(0,0,0,1)]"
            >
              <div className="h-full w-full px-2 py-4 xl:px-4">
                <span>{appName}</span>
              </div>
            </Link>
          </div>

          <div className="absolute left-1/2 flex h-16 -translate-x-1/2 space-x-[-2px] max-xl:hidden">
            <HeaderTab
              href="/items"
              text="Tradable Items"
              isSelected={pathname.search(/^\/items(\/|\?|$)/) !== -1}
            />
            {isRenderAllowed && (
              <>
                <HeaderTab
                  href="/my-items"
                  text="My Items"
                  isSelected={pathname.search(/^\/my-items(\/|\?|$)/) !== -1}
                />
                <HeaderTab
                  href="/my-wishes"
                  text="My Wishes"
                  isSelected={pathname.search(/^\/my-wishes(\/|\?|$)/) !== -1}
                />
                <HeaderTab
                  href="/trades"
                  text="Find Trades"
                  isSelected={pathname.search(/^\/trades(\/|\?|$)/) !== -1}
                />
              </>
            )}
          </div>

          <div className="max-xl:hidden">
            {isRenderAllowed ? (
              <>
                <span className="mr-4 whitespace-nowrap font-semibold text-white">
                  {user?.displayName ? `Hello, ${user.displayName}` : ''}
                </span>
                <input
                  className="mr-4 cursor-pointer rounded-md bg-white px-3 py-2 font-semibold hover:bg-gray-200"
                  type="submit"
                  value="Logout"
                  onClick={handleLogout}
                />
              </>
            ) : (
              pathname.search(/^\/(login|register)(\/|\?|$)/) === -1 && (
                <input
                  className="mr-4 cursor-pointer rounded-md bg-white px-3 py-2 font-semibold hover:bg-gray-200"
                  type="submit"
                  value="Login"
                  onClick={handleLogin}
                />
              )
            )}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed z-50 flex h-full w-full">
          <div className="flex h-full w-64 flex-col bg-blue-600">
            <div className="flex h-16 items-center">
              <ImageButton
                SvgImage={MenuSvg}
                className="ml-2 aspect-square h-10 rounded-full fill-white p-2 hover:bg-blue-400 hover:fill-black"
                title="Menu"
                onClick={handleCloseMenu}
              />

              {isRenderAllowed ? (
                <div className="p-4">
                  <span className="mr-4 whitespace-pre-wrap font-semibold text-white">
                    {user?.displayName ? `${user.displayName}` : ''}
                  </span>
                </div>
              ) : (
                <Link
                  href="/"
                  className="text-2xl font-bold text-white drop-shadow-[2px_2px_rgba(0,0,0,1)]"
                >
                  <div className="h-full w-full px-2 py-4">
                    <span>{appName}</span>
                  </div>
                </Link>
              )}
            </div>

            <hr />

            <div className="flex w-full flex-col">
              <SidebarTab
                href="/items"
                text="Tradable Items"
                isSelected={pathname.search(/^\/items(\/|\?|$)/) !== -1}
              />
              {isRenderAllowed && (
                <>
                  <SidebarTab
                    href="/my-items"
                    text="My Items"
                    isSelected={pathname.search(/^\/my-items(\/|\?|$)/) !== -1}
                  />
                  <SidebarTab
                    href="/my-wishes"
                    text="My Wishes"
                    isSelected={pathname.search(/^\/my-wishes(\/|\?|$)/) !== -1}
                  />
                  <SidebarTab
                    href="/trades"
                    text="Find Trades"
                    isSelected={pathname.search(/^\/trades(\/|\?|$)/) !== -1}
                  />
                </>
              )}
            </div>

            <hr />

            {isRenderAllowed ? (
              <button type="button" onClick={handleLogout}>
                <div className="flex w-full items-center text-white hover:bg-cyan-600 hover:text-black">
                  <div className="flex h-12 items-center px-4 font-semibold">
                    <span className="font-semibold">Logout</span>
                  </div>
                </div>
              </button>
            ) : (
              <button type="button" onClick={handleLogin}>
                <div className="flex w-full items-center text-white hover:bg-cyan-600 hover:text-black">
                  <div className="flex h-12 items-center px-4 font-semibold">
                    <span className="font-semibold">Login</span>
                  </div>
                </div>
              </button>
            )}
          </div>

          <input
            className="grow-[1] bg-[rgba(0,0,0,0.5)]"
            type="button"
            onClick={handleCloseMenu}
          />
        </div>
      )}
    </>
  );
};
