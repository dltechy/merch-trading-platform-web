import { Formik } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
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
        }): JSX.Element =>
          ((child: ReactNode): JSX.Element => (
            <>
              <FormCard
                title="Login"
                className="max-sm:hidden sm:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                {child}
              </FormCard>

              <div className="w-full p-8 sm:hidden">
                <h1 className="mb-6 text-4xl font-bold">Login</h1>
                {child}
              </div>
            </>
          ))(
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
                  className="text-link underline visited:text-link-visited hover:text-link-hovered"
                  href="/register"
                >
                  Register here
                </Link>
              </div>
            </form>,
          )
        }
      </Formik>
    </div>
  );
};

export default Login;
