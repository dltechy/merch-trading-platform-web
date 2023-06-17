import { Formik } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoginDto, loginValidator } from '@app/modules/auth/dtos/login.dto';
import {
  loginRequest,
  resetAuthState,
} from '@app/modules/auth/redux/auth.slice';
import { FormCard } from '@app/modules/common/components/FormCard';
import { LabelledTextBox } from '@app/modules/common/components/LabelledTextBox';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import { AppState } from '@app/redux/store';

const Login: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [isRenderAllowed, setIsRenderAllowed] = useState(false);

  const user = useSelector((state: AppState) => state.auth.user);
  const initializationState = useSelector(
    (state: AppState) => state.auth.initializationState,
  );
  const isLoginTriggered = useSelector(
    (state: AppState) => state.auth.login.isTriggered,
  );
  const isLoginLoading = useSelector(
    (state: AppState) => state.auth.login.isLoading,
  );
  const loginError = useSelector((state: AppState) => state.auth.login.error);

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    if (initializationState !== InitializationState.Initialized) {
      return;
    }

    if (user) {
      if (isLoginTriggered) {
        dispatch(
          addToastMessage({
            type: ToastType.Info,
            message: 'Login successful',
          }),
        );
      }

      Router.push('/items');
    } else {
      setIsRenderAllowed(true);
    }
  }, [initializationState, user, isLoginTriggered, dispatch]);

  useEffect(() => {
    if (!loginError) {
      return;
    }

    dispatch(
      addToastMessage({
        type: ToastType.Error,
        message: `Login failed: ${
          (loginError.response?.data as { message?: string })?.message ??
          loginError.message
        }`,
      }),
    );

    dispatch(resetAuthState({ login: true }));
  }, [loginError, dispatch]);

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

      <FormCard title="Login" className="w-1/4">
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

              <div className="mt-4">
                <span>No account yet? </span>
                <Link
                  className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                  href="/register"
                >
                  Register here
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </FormCard>
    </div>
  );
};

export default Login;
