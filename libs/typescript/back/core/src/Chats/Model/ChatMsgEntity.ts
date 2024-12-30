/* eslint-disable @typescript-eslint/no-inferrable-types */
import { EloEntity, EloProperty, WordLangEnum } from 'elo/back/core/Shared';

export type ChatMsgVoiceType = {
  rate?: number;
  volume?: number;
  mute?: boolean;
};

export type ChatMsgCommandType = {
  service: string;
  method: string;
  params?: { [key: string]: string | number | boolean };
};

export enum ChatMsgEmotionalTypesEnum {
  ok = 'ok',
  failed = 'failed',
}

export enum ChatMsgTypesEnum {
  text = 'text',
  markdown = 'markdown',
  button = 'button',
  data = 'data',
  hide = 'hide',
  progress = 'progress',
}

export enum ChatMsgEntityFieldsEnum {
  chatId = 'chatId',
  userId = 'userId',
  chatToken = 'chatToken',
  utc = 'utc',
  langId = 'langId',
  body = 'body',
  type = 'type',
  flowName = 'flowName',
  command = 'command',
  callback = 'callback',
  contextId = 'contextId',
  speechRecognitionResults = 'speechRecognitionResults',
  voice = 'voice',
  emotionalResponse = 'emotionalResponse',
  hidden = 'hidden',
}

export type ChatMsgEntityPkType = {
  chatId: string;
  utc: string;
};

export enum ChatMsgEntityIndexesEnum {
  pk = 'pk',
}

@EloEntity({
  name: 'chats-msgs',
  indexes: {
    [ChatMsgEntityIndexesEnum.pk]: {
      primaryKey: true,
      fields: [ChatMsgEntityFieldsEnum.chatId, ChatMsgEntityFieldsEnum.utc],
    },
  },
})
export class ChatMsgEntity {
  constructor(dto?: Partial<ChatMsgEntity>) {
    Object.assign(this, dto);
  }

  @EloProperty()
  [ChatMsgEntityFieldsEnum.chatId]: string = '';

  // Fields 'toUserId' are: 'A' + '-' + uuid/name | userId uuid
  // type:  'User uuid' | 'A-' + agentId (there are a "A-elo-system" agent, or form another provider)
  // Uuid can´t begin on 'A-', there aren´t colision with agents ids and its more easy to recognize
  @EloProperty()
  [ChatMsgEntityFieldsEnum.userId]: string = '';

  // List of userIds separated by '{ "userIds": ["x1","x2"]}', to void the need of read the chat table to know the users
  @EloProperty()
  [ChatMsgEntityFieldsEnum.chatToken]: string = '';

  @EloProperty()
  [ChatMsgEntityFieldsEnum.utc]: string = '';

  @EloProperty({ enum: WordLangEnum })
  [ChatMsgEntityFieldsEnum.langId]: WordLangEnum = WordLangEnum.es;

  @EloProperty()
  [ChatMsgEntityFieldsEnum.body]: string = '';

  @EloProperty({ enum: ChatMsgTypesEnum })
  [ChatMsgEntityFieldsEnum.type]: ChatMsgTypesEnum = ChatMsgTypesEnum.text;

  // Name of the active flow
  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.flowName]?: string = '';

  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.command]?: ChatMsgCommandType = undefined;

  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.callback]?: ChatMsgCommandType = undefined;

  // Each game or flow have a new contextId
  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.contextId]?: string = '';

  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.speechRecognitionResults]?: unknown = undefined;

  // Type of voice to speak
  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.voice]?: ChatMsgVoiceType = undefined;

  @EloProperty({ required: false, enum: ChatMsgEmotionalTypesEnum })
  [ChatMsgEntityFieldsEnum.emotionalResponse]?: ChatMsgEmotionalTypesEnum =
    ChatMsgEmotionalTypesEnum.ok;

  @EloProperty({ required: false })
  [ChatMsgEntityFieldsEnum.hidden]?: boolean = false;
}
