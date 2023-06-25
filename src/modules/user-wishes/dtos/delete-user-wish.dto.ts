import * as yup from 'yup';

export interface DeleteUserWishDto {
  id: string;
}

export const deleteUserWishValidator = yup.object({
  id: yup.string().uuid().required('Required'),
});
