import { Formik } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoginDto, loginValidator } from '@app/modules/auth/dtos/login.dto';
import {
  checkLoginStateRequest,
  loginRequest,
  resetAuthState,
} from '@app/modules/auth/redux/auth.slice';
import { FormCard } from '@app/modules/common/components/FormCard';
import { LabelledTextBox } from '@app/modules/common/components/LabelledTextBox';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import { AppState } from '@app/redux/store';

const Login: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [initializationState, setInitializationState] = useState(
    InitializationState.Uninitialized,
  );
  const [isRenderAllowed, setIsRenderAllowed] = useState(false);

  const user = useSelector((state: AppState) => state.auth.user);
  const isLoginLoading = useSelector(
    (state: AppState) => state.auth.login.isLoading,
  );
  const loginError = useSelector((state: AppState) => state.auth.login.error);
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
      Router.push('/');
    } else {
      setIsRenderAllowed(true);
    }
  }, [initializationState, user]);

  // Handlers

  const handleLogin = (dto: LoginDto): void => {
    if (isLoginLoading) {
      return;
    }

    dispatch(loginRequest(dto));
  };

  // Elements

  if (!isRenderAllowed) {
    return undefined;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>{`${appName} - Login`}</title>
      </Head>

      <FormCard title={`${appName} - Login`} className="w-1/4">
        {loginError && (
          <p className="mb-6 font-normal italic text-red-500">
            {(loginError.response?.data as { message?: string })?.message ??
              loginError.message}
          </p>
        )}

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidator}
          onSubmit={handleLogin}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            handleBlur,
            handleChange,
          }): JSX.Element => (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <LabelledTextBox
                  id="email"
                  label="Email"
                  hasError={!!errors.email && touched.email}
                  error={errors.email}
                  type="text"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />

                <LabelledTextBox
                  id="password"
                  label="Password"
                  hasError={!!errors.password && touched.password}
                  error={errors.password}
                  type="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>

              <PrimaryButton
                className="mt-8"
                value={isLoginLoading ? 'Logging in...' : 'Login'}
                disabled={isLoginLoading}
              />
            </form>
          )}
        </Formik>
      </FormCard>
    </div>
  );
};

export default Login;
