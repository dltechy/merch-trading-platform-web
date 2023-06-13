import * as yup from 'yup';

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export const registerValidator = yup.object({
  email: yup.string().email('Invalid email format').required('Required'),
  password: yup.string().required('Required'),
  confirmPassword: yup
    .string()
    .required('Required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  displayName: yup.string().required('Required'),
});
