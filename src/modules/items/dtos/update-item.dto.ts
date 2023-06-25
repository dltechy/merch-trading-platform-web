import * as yup from 'yup';

export interface UpdateItemDto {
  id: string;
  name?: string;
  description?: string;
}

export const updateItemValidator = yup.object({
  name: yup.string(),
  description: yup.string(),
});
