import { Injectable } from '@nestjs/common';
import { EloDynamoDb } from 'elo/back/core/Adapters/Adapters';
import {
  ChatMsgEntity,
  ChatMsgEntityIndexesEnum,
  ChatMsgEntityPkType,
} from 'elo/back/core/Chats/Model';
import { ChatsMsgsRepoPort } from 'elo/back/core/Chats/Ports';

@Injectable()
export class ChatsMsgsRepoDynamoDbAdapter implements ChatsMsgsRepoPort {
  constructor() {}

  async insert(entity: ChatMsgEntity): Promise<ChatMsgEntity> {
    // console.log(
    //   'ºº ~ file: ChatsMsgsDynamoDbRepository ~ insert ~ entity:',
    //   entity
    // );

    try {
      return await EloDynamoDb.upsert(ChatMsgEntity, entity);
    } catch (e) {
      console.error('ChatsMsgsDynamoDbRepository.insert:', entity, e);
      throw e;
    }
  }

  async getAllByChatId(params: {
    chatId: string;
    limit?: number;
  }): Promise<ChatMsgEntity[]> {
    // console.log(
    //   'ºº ~ file: ChatsMsgsDynamoDbRepository ~ getAllByChatId ~ params:',
    //   params
    // );

    const resp = await EloDynamoDb.query<ChatMsgEntity>(
      ChatMsgEntity,
      ChatMsgEntityIndexesEnum.pk,
      params.chatId,
      null,
      { limit: params.limit, reverse: true }
    );
    resp.reverse();
    return resp;
  }

  async getByIdAndUtc({
    chatId,
    utc,
  }: ChatMsgEntityPkType): Promise<ChatMsgEntity | null> {
    const resp = await EloDynamoDb.query<ChatMsgEntity>(
      ChatMsgEntity,
      ChatMsgEntityIndexesEnum.pk,
      chatId,
      utc
    );

    return resp.length ? resp[0] : null;
  }

  async getByChatId(params: {
    chatId: string;
    limit?: number;
  }): Promise<ChatMsgEntity[]> {
    console.log(
      'ºº ~ file: ChatsMsgsDynamoDbRepository ~ getById ~ params:',
      params
    );

    try {
      const resp = await EloDynamoDb.query<ChatMsgEntity>(
        ChatMsgEntity,
        ChatMsgEntityIndexesEnum.pk,
        params.chatId,
        null,
        { limit: params.limit, reverse: true }
      );

      return resp;
    } catch (e) {
      console.error('ERROR: ChatsMsgsDynamoDbRepository.getById:', params, e);
      return [];
    }
  }

  async update(entity: Partial<ChatMsgEntity>): Promise<void> {
    console.log(
      'ºº ~ file: ChatsMsgsDynamoDbRepository ~ update ~ entity:',
      entity
    );
    await EloDynamoDb.update(
      ChatMsgEntity,
      entity,
      ChatMsgEntityIndexesEnum.pk,
      entity.chatId
    );
  }

  async delete(pk: ChatMsgEntityPkType): Promise<void> {
    console.log('ºº ~ file: ChatsMsgsDynamoDbRepository ~ delete ~ id:', pk);
    await EloDynamoDb.delete(
      ChatMsgEntity,
      ChatMsgEntityIndexesEnum.pk,
      pk.chatId,
      pk.utc
    );
  }
}
