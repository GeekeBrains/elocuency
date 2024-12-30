import { ChatEntity, ChatEntityPkType } from 'elo/back/core/Chats/Model';

export interface ChatsRepoPort {
  insert(chat: ChatEntity): Promise<ChatEntity>;
  getById(params: { chatId: string }): Promise<ChatEntity | null>;
  update(chat: Partial<ChatEntity>): Promise<void>;
  delete(pk: ChatEntityPkType): Promise<void>;
}
