import {
  ChatUserEntity,
  ChatUserEntityPkType,
} from 'elo/back/server/Chats/Model';

export interface ChatsUsersRepoPort {
  insert(chatUser: ChatUserEntity): Promise<ChatUserEntity>;
  getUsersByChatId(params: {
    chatId: string;
    limit?: number;
  }): Promise<ChatUserEntity[]>;
  getChatsByUserId(params: { userId: string }): Promise<ChatUserEntity[]>;
  getById(pk: ChatUserEntityPkType): Promise<ChatUserEntity | null>;
  update(chatUser: Partial<ChatUserEntity>): Promise<void>;
  delete(pk: ChatUserEntityPkType): Promise<void>;
}
