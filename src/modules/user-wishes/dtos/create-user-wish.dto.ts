import * as yup from 'yup';

export interface CreateUserWishDto {
  itemId: string;
  remarks: string;
  itemModifierIds: string[];
}

export interface CreateUserWishFormData {
  itemName: string;
  itemDescription: string;
  remarks: string;
}

export const createUserWishValidator = yup.object({
  itemName: yup.string().required('Required'),
  itemDescription: yup.string(),
  remarks: yup.string(),
});
