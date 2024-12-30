import { ChatMsgEntity, ChatMsgEntityPkType } from 'elo/back/core/Chats/Model';

export interface ChatsMsgsRepoPort {
  insert(entity: ChatMsgEntity): Promise<ChatMsgEntity>;
  getAllByChatId(params: {
    chatId: string;
    limit?: number;
  }): Promise<ChatMsgEntity[]>;
  getByIdAndUtc(pk: ChatMsgEntityPkType): Promise<ChatMsgEntity | null>;
  getByChatId(params: {
    chatId: string;
    limit?: number;
  }): Promise<ChatMsgEntity[]>;
  update(entity: Partial<ChatMsgEntity>): Promise<void>;
  delete(pk: ChatMsgEntityPkType): Promise<void>;
}
