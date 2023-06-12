import * as yup from 'yup';

export interface LoginDto {
  email: string;
  password: string;
}

export const loginValidator = yup.object({
  email: yup.string().email('Invalid email format').required('Required'),
  password: yup.string().required('Required'),
});
