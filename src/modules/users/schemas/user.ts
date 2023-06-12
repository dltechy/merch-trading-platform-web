import { UserRole } from './user-role';

export interface User {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  createdAt?: Date;
  updatedAt?: Date;
}
