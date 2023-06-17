import * as yup from 'yup';

import { SortOrder } from '@app/modules/common/constants/sort-order';

export enum GetItemsSortBy {
  Name = 'name',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export interface GetItemsDto {
  searchName?: string;
  page?: number;
  count?: number;
  sortBy?: GetItemsSortBy;
  sortOrder?: SortOrder;
}

export const getItemsValidator = yup.object({
  searchName: yup.string().default(''),
  page: yup.number().min(1, 'Page must be 1 or more').default(1),
  count: yup.number().min(1, 'Count must be 1 or more').default(1),
  sortBy: yup.string().oneOf(Object.values(GetItemsSortBy)),
  sortOrder: yup.string().oneOf(Object.values(SortOrder)),
});
