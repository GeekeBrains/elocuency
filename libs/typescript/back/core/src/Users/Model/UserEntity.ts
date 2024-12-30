/* eslint-disable @typescript-eslint/no-inferrable-types */
import { EloEntity, EloProperty, WordLangEnum } from 'elo/back/core/Shared';

export enum UserEntityFieldsEnum {
  userId = 'userId',
  email = 'email',
  name = 'name',
  password = 'password',
  nativeLangId = 'nativeLangId',
  // targetLangId = 'targetLangId',
  currentChatId = 'currentChatId',
  avatarUrl = 'avatarUrl',
  sessionToken = 'sessionToken',
  // level = 'level',
  // successWordsWritingGame = 'successWordsWritingGame',
  // successWordsSpeakingGame = 'successWordsSpeakingGame',
  // totalWordsGame = 'totalWordsGame',
  // currentGameId = 'currentGameId',
  flowName = 'flowName',
  externalLoginProviderType = 'externalLoginProviderType',
  pushSubscriptionRaw = 'pushSubscriptionRaw',
}

export enum UserEntityIndexesEnum {
  pk = 'pk',
  email = 'email',
}

export type UserEntityPkType = {
  [UserEntityFieldsEnum.userId]: string;
};

@EloEntity({
  name: 'users',
  indexes: {
    [UserEntityIndexesEnum.pk]: {
      primaryKey: true,
      fields: [UserEntityFieldsEnum.userId],
    },
    [UserEntityIndexesEnum.email]: {
      fields: [UserEntityFieldsEnum.email],
    },
  },
})
export class UserEntity {
  constructor(dto?: Partial<UserEntity>) {
    Object.assign(this, dto);
  }

  @EloProperty({ isPrimaryKey: true })
  userId: string = '';

  @EloProperty({ index: true })
  email: string = '';

  @EloProperty({ required: true })
  name: string = '';

  @EloProperty({ required: false })
  password?: string = '';

  @EloProperty({ enum: WordLangEnum, required: true })
  nativeLangId: WordLangEnum = WordLangEnum.es;

  @EloProperty({ enum: WordLangEnum, required: true })
  targetLangId: WordLangEnum = WordLangEnum.es;

  @EloProperty({ required: false })
  currentChatId?: string = '';

  @EloProperty({ required: false })
  avatarUrl?: string = '';

  @EloProperty({ required: false })
  sessionToken?: string = '';

  @EloProperty({ required: true })
  level = 0;

  @EloProperty({ required: true })
  successWordsWritingGame = 0;

  @EloProperty({ required: true })
  successWordsSpeakingGame = 0;

  @EloProperty({ required: true })
  totalWordsGame = 0;

  @EloProperty({ required: false })
  currentGameId: string = '';

  @EloProperty({ required: false })
  flowName: string = '';

  // When login is created with external provider, like Google, Facebook, etc.
  @EloProperty({ required: false })
  externalLoginProviderType?: string = '';

  // Push notifications subscription
  // Its a json on raw string with the push subscription object to call the push service
  @EloProperty({ required: false })
  pushSubscriptionRaw?: string = '';
}
