import * as yup from 'yup';

export interface UpdateUserWishDto {
  id: string;
  remarks?: string;
  itemModifierIds?: string[];
}

export const updateUserWishValidator = yup.object({
  remarks: yup.string(),
});
