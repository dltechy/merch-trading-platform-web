import * as yup from 'yup';

import { SortOrder } from '@app/modules/common/constants/sort-order';

export enum GetUserWishesSortBy {
  UserDisplayName = 'userDisplayName',
  ItemName = 'itemName',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export interface GetUserWishesDto {
  searchUserId?: string;
  searchUserEmail?: string;
  searchUserDisplayName?: string;
  searchItemId?: string;
  searchItemName?: string;
  page?: number;
  count?: number;
  sortBy?: GetUserWishesSortBy;
  sortOrder?: SortOrder;
}

export const getMyWishesValidator = yup.object({
  searchItemName: yup.string().default(''),
  page: yup.number().min(1, 'Page must be 1 or more').default(1),
  count: yup.number().min(1, 'Count must be 1 or more').default(1),
  sortBy: yup.string().oneOf(Object.values(GetUserWishesSortBy)),
  sortOrder: yup.string().oneOf(Object.values(SortOrder)),
});
