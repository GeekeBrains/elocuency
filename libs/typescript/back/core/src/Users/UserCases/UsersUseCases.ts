import { ConflictException, Injectable } from '@nestjs/common';
import bcryptjs from 'bcryptjs';

import { UserEntity } from 'elo/back/core/Users/Model';
import { IsValid } from 'elo/back/core/Shared';
import { UsersRepoPort } from 'elo/back/core/Users/Ports';

@Injectable()
export class UsersUseCases {
  constructor(private readonly usersRepository: UsersRepoPort) {}

  isValid(user: UserEntity) {
    return (
      user.email &&
      IsValid.email(user.email) &&
      user.name &&
      IsValid.password(user.password) &&
      user.nativeLangId &&
      user.targetLangId
    );
  }

  async insert(user: UserEntity) {
    if (!this.isValid(user)) {
      throw new Error('UsersUseCases.insert: Invalid user fields.');
    }

    if (await this.usersRepository.getByEmail({ email: user.email })) {
      throw new ConflictException(`User with email already exists.`);
    }
    user.password = bcryptjs.hashSync(user.password);
    this.usersRepository.insert(user);
  }

  async getById(params: { userId: string }): Promise<UserEntity> {
    return this.usersRepository.getById(params);
  }

  async getByEmail(params: { email: string }): Promise<UserEntity> {
    return this.usersRepository.getByEmail(params);
  }

  async update(user: Partial<UserEntity>) {
    return this.usersRepository.update(user);
  }

  // async upsert(user: UserEntity) {
  //   return this.usersRepository.upsert(user);
  // }

  async delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
