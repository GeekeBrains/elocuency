/* eslint-disable @typescript-eslint/no-inferrable-types */
import { EloEntity, EloProperty } from 'elo/back/core/Shared';

export enum ChatEntityFieldsEnum {
  chatId = 'chatId',
  name = 'name',
  /* To optimize resending msg this field have all userId of Chat 
    sended on a JWT token to void hackers from client and send to 
    a userId not allowed.

    { 
      userIds: ['...', '...'],
    }
  */
  chatToken = 'chatToken',
}

export type ChatEntityPkType = {
  chatId: string;
};

export enum ChatEntityIndexesEnum {
  pk = 'pk',
}

@EloEntity({
  name: 'chats',
  indexes: {
    [ChatEntityIndexesEnum.pk]: {
      primaryKey: true,
      fields: [ChatEntityFieldsEnum.chatId],
    },
  },
})
export class ChatEntity {
  constructor(dto?: Partial<ChatEntity>) {
    Object.assign(this, dto);
  }

  @EloProperty()
  [ChatEntityFieldsEnum.chatId]: string = '';

  @EloProperty()
  [ChatEntityFieldsEnum.name]: string = '';

  @EloProperty()
  [ChatEntityFieldsEnum.chatToken]: string = '';
}
