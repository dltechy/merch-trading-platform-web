import { Formik } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { checkLoginStateRequest } from '@app/modules/auth/redux/auth.slice';
import { FormCard } from '@app/modules/common/components/FormCard';
import { LabelledTextBox } from '@app/modules/common/components/LabelledTextBox';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { SecondaryButton } from '@app/modules/common/components/SecondaryButton';
import { InitializationState } from '@app/modules/common/states/initialization-state';
import {
  RegisterDto,
  registerValidator,
} from '@app/modules/registration/dtos/register.dto';
import {
  registerRequest,
  resetRegistrationState,
} from '@app/modules/registration/redux/registration.slice';
import { AppState } from '@app/redux/store';

const Register: NextPage = () => {
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

  const isRegisterTriggered = useSelector(
    (state: AppState) => state.registration.register.isTriggered,
  );
  const isRegisterLoading = useSelector(
    (state: AppState) => state.registration.register.isLoading,
  );
  const registerError = useSelector(
    (state: AppState) => state.registration.register.error,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    dispatch(checkLoginStateRequest());

    return () => {
      dispatch(resetRegistrationState());
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
  }, [initializationState, user, dispatch]);

  useEffect(() => {
    if (!isRegisterTriggered || isRegisterLoading || registerError) {
      return;
    }

    Router.push('/login');
  }, [isRegisterTriggered, isRegisterLoading, registerError, dispatch]);

  // Handlers

  const handleRegister = (dto: RegisterDto): void => {
    if (isRegisterLoading) {
      return;
    }

    dispatch(registerRequest(dto));
  };

  const handleCancel = (): void => {
    Router.push('/login');
  };

  // Elements

  if (!isRenderAllowed) {
    return undefined;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Head>
        <title>{`${appName} - Registration`}</title>
      </Head>

      <FormCard title={`${appName} - Register`} className="w-1/4">
        {registerError && (
          <p className="mb-6 font-normal italic text-red-500">
            {(registerError.response?.data as { message?: string })?.message ??
              registerError.message}
          </p>
        )}

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            displayName: '',
          }}
          validationSchema={registerValidator}
          onSubmit={handleRegister}
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

                <LabelledTextBox
                  id="confirmPassword"
                  label="Confirm password"
                  hasError={!!errors.confirmPassword && touched.confirmPassword}
                  error={errors.confirmPassword}
                  type="password"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />

                <LabelledTextBox
                  id="displayName"
                  label="Display name"
                  hasError={!!errors.displayName && touched.displayName}
                  error={errors.displayName}
                  type="text"
                  value={values.displayName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-8 flex flex-row-reverse space-x-4 space-x-reverse">
                <PrimaryButton
                  value={isRegisterLoading ? 'Registering...' : 'Register'}
                  disabled={isRegisterLoading}
                />
                <SecondaryButton value="Cancel" onClick={handleCancel} />
              </div>
            </form>
          )}
        </Formik>
      </FormCard>
    </div>
  );
};

export default Register;
