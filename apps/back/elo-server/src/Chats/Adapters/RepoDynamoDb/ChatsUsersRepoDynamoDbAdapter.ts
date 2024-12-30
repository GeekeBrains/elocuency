import { Injectable } from '@nestjs/common';
import { EloDynamoDb } from 'elo/back/core/Adapters/Adapters';
import {
  ChatUserEntity,
  ChatUserEntityIndexesEnum,
  ChatUserEntityPkType,
} from 'elo/back/server/Chats/Model';

import { ChatsUsersRepoPort } from 'elo/back/server/Chats/Ports';

@Injectable()
export class ChatsUsersRepoDynamoDbAdapter implements ChatsUsersRepoPort {
  constructor() {}

  async insert(chatUser: ChatUserEntity): Promise<ChatUserEntity> {
    try {
      return await EloDynamoDb.upsert(ChatUserEntity, chatUser);
    } catch (e) {
      console.error('ChatsUsersRepoDynamoDbAdapter.insert:', chatUser, e);
      throw e;
    }
  }

  async getUsersByChatId(params: {
    chatId: string;
  }): Promise<ChatUserEntity[]> {
    const resp = await EloDynamoDb.query<ChatUserEntity>(
      ChatUserEntity,
      ChatUserEntityIndexesEnum.pk,
      params.chatId,
      null
    );
    return resp;
  }

  async getChatsByUserId(params: { userId: string }) {
    const resp = await EloDynamoDb.query<ChatUserEntity>(
      ChatUserEntity,
      ChatUserEntityIndexesEnum.userId,
      params.userId,
      null
    );
    return resp;
  }

  async getById({
    chatId,
    userId,
  }: ChatUserEntityPkType): Promise<ChatUserEntity | null> {
    const resp = await EloDynamoDb.query<ChatUserEntity>(
      ChatUserEntity,
      ChatUserEntityIndexesEnum.pk,
      chatId,
      userId
    );

    return resp.length ? resp[0] : null;
  }

  async update(entity: Partial<ChatUserEntity>): Promise<void> {
    await EloDynamoDb.update(
      ChatUserEntity,
      entity,
      ChatUserEntityIndexesEnum.pk,
      entity.chatId
    );
  }

  async delete(pk: ChatUserEntityPkType): Promise<void> {
    await EloDynamoDb.delete(
      ChatUserEntity,
      ChatUserEntityIndexesEnum.pk,
      pk.chatId,
      pk.userId
    );
  }
}
