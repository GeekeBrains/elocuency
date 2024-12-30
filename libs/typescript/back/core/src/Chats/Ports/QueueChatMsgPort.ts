import { ChatMsgEntity } from 'elo/back/core/Chats/Model';

export interface QueueChatMsgPort {
  send(params: { chatMsg: ChatMsgEntity; serviceTo?: string }): Promise<void>;
}
