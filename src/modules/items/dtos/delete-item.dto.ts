import * as yup from 'yup';

export interface DeleteItemDto {
  id: string;
}

export const deleteItemValidator = yup.object({
  id: yup.string().uuid().required('Required'),
});
