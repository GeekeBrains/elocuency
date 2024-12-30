import { Injectable } from '@nestjs/common';

import { UserEntity, UserEntityIndexesEnum } from 'elo/back/core/Users/Model';
import { EloDynamoDb } from 'elo/back/core/Adapters/Adapters';
import { UsersRepoPort } from '../../Ports';

@Injectable()
export class UsersRepoDynamoDb implements UsersRepoPort {
  // constructor() {}

  async insert(userEntity: UserEntity) {
    console.log(
      'ºº ~ file: users.DDbrepository.ts:15 ~ insert ~ userEntity:',
      userEntity
    );

    await EloDynamoDb.insert<UserEntity>(UserEntity, userEntity);
  }

  async getByEmail(params: { email: string }): Promise<UserEntity | null> {
    console.log(
      'ºº ~ file: .ts:2UsersDDbRepository9 ~ getByEmail ~ email:',
      params.email
    );

    const resp = await EloDynamoDb.query(
      UserEntity,
      UserEntityIndexesEnum.email,
      params.email
    );
    if (resp.length === 0) return null;

    const user = new UserEntity(resp[0] as unknown as UserEntity);
    console.log(
      'ºº ~ file: users.dynamo.repository.ts:27 ~ getByEmail ~ user:',
      user
    );

    return user;
  }

  async getById(params: { userId: string }): Promise<UserEntity | null> {
    try {
      const resp = await await EloDynamoDb.query(
        UserEntity,
        UserEntityIndexesEnum.pk,
        params.userId
      );
      const user = new UserEntity(resp[0] as unknown as UserEntity);
      // console.log(
      //   'ºº ~ file: UsersDDbRepository.ts:54 ~ UsersDDbRepository ~ getById ~ user:',
      //   user
      // );
      return user;
    } catch (err) {
      console.error('UsersRepository.read:', err);
    }
  }

  // async update(user: Partial<UserEntity>) {
  //   const userId = user.userId;
  //   delete user.userId;
  //   await await EloDynamoDb.update(userId, user);
  // }

  async delete(id: string) {
    await await EloDynamoDb.delete(UserEntity, UserEntityIndexesEnum.pk, id);
  }

  async update(user: Partial<UserEntity>): Promise<void> {
    console.log(
      'ºº ~ file: UsersDDbRepository.ts:75 ~ UsersDDbRepository ~ update ~ user:',
      user
    );
    const userId = user.userId;
    delete user.userId;
    await EloDynamoDb.update(
      UserEntity,
      user,
      UserEntityIndexesEnum.pk,
      userId
    );
  }
}
