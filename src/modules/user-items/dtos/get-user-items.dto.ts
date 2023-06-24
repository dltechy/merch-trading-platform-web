import * as yup from 'yup';

import { SortOrder } from '@app/modules/common/constants/sort-order';

export enum GetUserItemsSortBy {
  UserDisplayName = 'userDisplayName',
  ItemName = 'itemName',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export interface GetUserItemsDto {
  searchUserId?: string;
  searchUserEmail?: string;
  searchUserDisplayName?: string;
  searchItemId?: string;
  searchItemName?: string;
  page?: number;
  count?: number;
  sortBy?: GetUserItemsSortBy;
  sortOrder?: SortOrder;
}

export const getMyItemsValidator = yup.object({
  searchItemName: yup.string().default(''),
  page: yup.number().min(1, 'Page must be 1 or more').default(1),
  count: yup.number().min(1, 'Count must be 1 or more').default(1),
  sortBy: yup.string().oneOf(Object.values(GetUserItemsSortBy)),
  sortOrder: yup.string().oneOf(Object.values(SortOrder)),
});
