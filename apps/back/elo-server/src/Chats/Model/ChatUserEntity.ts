import { EloEntity, EloProperty } from 'elo/back/core/Shared';

export enum ChatUserEntityFieldsEnum {
  chatId = 'chatId',
  userId = 'userId',
  isAdmin = 'isAdmin',
}

export type ChatUserEntityPkType = {
  chatId: string;
  userId: string;
};

export enum ChatUserEntityIndexesEnum {
  pk = 'pk',
  userId = 'userId',
}

@EloEntity({
  name: 'chats-users',
  indexes: {
    [ChatUserEntityIndexesEnum.pk]: {
      primaryKey: true,
      fields: [
        ChatUserEntityFieldsEnum.chatId,
        ChatUserEntityFieldsEnum.userId,
      ],
    },
    [ChatUserEntityIndexesEnum.userId]: {
      fields: [ChatUserEntityFieldsEnum.userId],
    },
  },
})
export class ChatUserEntity {
  constructor(dto?: Partial<ChatUserEntity>) {
    Object.assign(this, dto);
  }

  @EloProperty()
  [ChatUserEntityFieldsEnum.chatId] = '';

  @EloProperty()
  [ChatUserEntityFieldsEnum.userId] = '';

  @EloProperty({ required: false })
  [ChatUserEntityFieldsEnum.isAdmin]? = false;
}
