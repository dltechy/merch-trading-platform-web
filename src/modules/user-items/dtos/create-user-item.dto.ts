import * as yup from 'yup';

export interface CreateUserItemDto {
  itemId: string;
  remarks: string;
  itemModifierIds: string[];
}

export interface CreateUserItemFormData {
  itemName: string;
  itemDescription: string;
  remarks: string;
}

export const createUserItemValidator = yup.object({
  itemName: yup.string().required('Required'),
  itemDescription: yup.string(),
  remarks: yup.string(),
});
