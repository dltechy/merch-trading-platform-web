import * as yup from 'yup';

export interface UpdateUserItemDto {
  id: string;
  remarks?: string;
  itemModifierIds?: string[];
}

export const updateUserItemValidator = yup.object({
  remarks: yup.string(),
});
