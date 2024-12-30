import { Injectable } from '@nestjs/common';
import { EloDynamoDb } from 'elo/back/core/Adapters/Adapters';
import {
  ChatEntity,
  ChatEntityPkType,
  ChatEntityIndexesEnum,
} from 'elo/back/core/Chats/Model';
import { ChatsRepoPort } from 'elo/back/server/Chats/Ports';

@Injectable()
export class ChatsRepoDynamoDbAdapter implements ChatsRepoPort {
  constructor() {}

  async insert(chat: ChatEntity): Promise<ChatEntity> {
    console.log('ºº ~ file: ChatsDynamoDbRepository ~ insert ~ chat:', chat);
    await EloDynamoDb.upsert(ChatEntity, chat);
    return chat;
  }

  async getById(params: { chatId: string }): Promise<ChatEntity | null> {
    const result = await EloDynamoDb.query<ChatEntity>(
      ChatEntity,
      ChatEntityIndexesEnum.pk, // Suponiendo que chatId es el índice primario
      params.chatId
    );
    return result.length ? result[0] : null;
  }

  async update(chat: Partial<ChatEntity>): Promise<void> {
    console.log('ºº ~ file: ChatsDynamoDbRepository ~ update ~ chat:', chat);
    await EloDynamoDb.update(
      ChatEntity,
      chat,
      ChatEntityIndexesEnum.pk,
      chat.chatId
    );
  }

  async delete(pk: ChatEntityPkType): Promise<void> {
    console.log('ºº ~ file: ChatsDynamoDbRepository ~ delete ~ id:', pk);
    await EloDynamoDb.delete(
      ChatEntity,
      ChatEntityIndexesEnum.pk, // Suponiendo que chatId es el índice primario
      pk.chatId
    );
  }
}
