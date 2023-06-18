import * as yup from 'yup';

export interface CreateItemDto {
  name: string;
  description: string;
}

export const createItemValidator = yup.object({
  name: yup.string().required('Required'),
  description: yup.string(),
});
