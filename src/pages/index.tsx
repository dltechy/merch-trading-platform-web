import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  checkLoginStateRequest,
  logoutRequest,
} from '@app/modules/auth/redux/auth.slice';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import { AppState } from '@app/redux/store';

const Home: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

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
  }, [dispatch]);

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
    } else {
      Router.push('/login');
    }
  }, [initializationState, user]);

  // Handlers

  const handleLogout = (e: FormEvent): void => {
    e.preventDefault();

    dispatch(logoutRequest());
  };

  // Elements

  if (!isRenderAllowed) {
    return undefined;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>{`${appName}`}</title>
      </Head>

      <form className="w-1/4" onSubmit={handleLogout}>
        <PrimaryButton value="Logout" />
      </form>
    </div>
  );
};

export default Home;
