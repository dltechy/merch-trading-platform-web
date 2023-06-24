import { Item } from '@app/modules/items/schemas/item';
import { User } from '@app/modules/users/schemas/user';

export interface UserItem {
  id: string;
  user?: User;
  item?: Item;
  remarks: string;
  createdAt?: Date;
  updatedAt?: Date;
}
