import { UserEntity } from 'elo/back/core/Users/Model';

export interface UsersRepoPort {
  insert(userEntity: UserEntity): Promise<void>;

  getByEmail(params: { email: string }): Promise<UserEntity | null>;

  getById(params: { userId: string }): Promise<UserEntity | null>;

  update(user: Partial<UserEntity>): Promise<void>;

  delete(id: string): Promise<void>;
}
