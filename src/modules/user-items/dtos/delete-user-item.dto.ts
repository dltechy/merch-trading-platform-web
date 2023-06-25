import * as yup from 'yup';

export interface DeleteUserItemDto {
  id: string;
}

export const deleteUserItemValidator = yup.object({
  id: yup.string().uuid().required('Required'),
});
