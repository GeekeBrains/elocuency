import { Injectable } from '@nestjs/common';

import { ChatsRepoPort, ChatsUsersRepoPort } from 'elo/back/server/Chats/Ports';
import { ChatTokenHelper, getUuid } from 'elo/back/core/Shared';
import { UserEntity } from 'elo/back/core/Users/Model';
import { UsersRepoPort } from 'elo/back/core/Users/Ports';
import { ApiProperty } from '@nestjs/swagger';
import {
  ChatEntity,
  ChatEntityPkType,
  ChatMsgEntity,
  ChatMsgEntityPkType,
} from 'elo/back/core/Chats/Model';
import { ChatsMsgsRepoPort } from 'elo/back/core/Chats/Ports';

// // @Entity()
// // Extend ChatMsgEntity
// export class ChatMsgType {
//   @EloProperty({ isPrimaryKey: true })
//   chatId: string = '';

//   // Fields 'from' and 'to' are: 'type' + uuid
//   // type: 'G' chatGroupId | 'U' userId | 'A' agentId | 'S' system?
//   @EloProperty()
//   fromUserId: string = '';

//   @EloProperty()
//   to: string = '';

//   @EloProperty({ enum: WordLangEnum })
//   langId: WordLangEnum = WordLangEnum.es;

//   @EloProperty()
//   body: string = '';

//   @EloProperty({ enum: ChatMsgTypesEnum })
//   type: ChatMsgTypesEnum = ChatMsgTypesEnum.text;

//   // Functions of the flow to exec for the response
//   // Ex: getResponse('typeA')
//   //  Exec: flowName.getResponse('typeA')
//   // @Property({ required: false })
//   // commandExec?: string = '';

//   // Json to create context vars.
//   //    Ex: { url: 'lskdjfjklsdf'}
//   // The sum of all msgs context value, complety context of the flow.
//   // @Property({ required: false })
//   // context?: string = '';

//   // @Property({ required: false })
//   // data?: string = '';
// }

export class ChatRespDto extends ChatEntity {
  @ApiProperty({ type: [UserEntity] })
  users: Partial<UserEntity>[] = [];
}

@Injectable()
export class ChatsUseCases {
  constructor(
    private readonly chatsRepo: ChatsRepoPort,
    private readonly chatsMsgsRepo: ChatsMsgsRepoPort,
    private readonly chatsUsersRepo: ChatsUsersRepoPort,
    private readonly usersRepo: UsersRepoPort
  ) {}

  // async generateResponse(params: {
  //   chatMsg: ChatMsgType;
  // }): Promise<ChatMsgEntity[]> {
  //   return this.chatsResponseGenerator.generateResponse({
  //     chatMsg: params.chatMsg,
  //   });
  // }

  async create(chat: ChatEntity) {
    this.chatsRepo.insert(chat);
  }

  async addByUsers(params: {
    chatName: string;
    userIdAdmin: string;
    userKey: string;
  }): Promise<ChatEntity> {
    let userIdTo = '';
    let chatName = params.chatName;
    if (this.isEmail(params.userKey)) {
      const user = await this.usersRepo.getByEmail({ email: params.userKey });
      userIdTo = user.userId;
      chatName = user.name;
    } else if (this.isUuid(params.userKey)) {
      const user = await this.usersRepo.getById({ userId: params.userKey });
      userIdTo = user.userId;
      chatName = user.name;
    }
    const chatId = getUuid();
    const chat = await this.chatsRepo.insert({
      chatId,
      name: chatName,
      chatToken: JSON.stringify({ userIds: [params.userIdAdmin, userIdTo] }),
    });

    await this.chatsUsersRepo.insert({
      chatId: chatId,
      userId: params.userIdAdmin,
      isAdmin: true,
    });
    await this.chatsUsersRepo.insert({
      chatId: chatId,
      userId: userIdTo,
    });

    return chat;
  }

  async get(chatId: string): Promise<ChatEntity> {
    return this.chatsRepo.getById({ chatId });
  }

  async update(chat: Partial<ChatEntity>) {
    return this.chatsRepo.update(chat);
  }

  async delete(pk: ChatEntityPkType) {
    return this.chatsRepo.delete(pk);
  }

  async createMsg(chat: ChatMsgEntity) {
    this.chatsMsgsRepo.insert(chat);
  }

  async getChatsByUserId(params: { userId: string }): Promise<ChatRespDto[]> {
    console.log(
      'ºº ~ file: ChatsUseCases.ts:92 ~ ChatsUseCases ~ getChatsByUserId ~ params:',
      params
    );
    const chatUsers = await this.chatsUsersRepo.getChatsByUserId(params);
    console.log(
      'ºº ~ file: ChatsUseCases.ts:93 ~ ChatsUseCases ~ getChatsByUserId ~ chatUsers:',
      chatUsers
    );
    const users: Partial<UserEntity>[] = [];
    const chats: ChatRespDto[] = await Promise.all(
      chatUsers.map(async (chatUser) => {
        const chat = await this.chatsRepo.getById({ chatId: chatUser.chatId });
        console.log(
          'ºº ~ file: ChatsUseCases.ts:146 ~ ChatsUseCases ~ chatUsers.map ~ chat:',
          chat
        );
        const userIds = JSON.parse(chat.chatToken).userIds;
        console.log(
          'ºº ~ file: ChatsUseCases.ts:148 ~ ChatsUseCases ~ chatUsers.map ~ userIds:',
          userIds
        );

        for (const userId of userIds) {
          const user = await this.usersRepo.getById({
            userId,
          });
          console.log(
            'ºº ~ file: ChatsUseCases.ts:156 ~ ChatsUseCases ~ userIds.map ~ user:',
            user.name
          );
          users.push({ userId: user.userId, name: user.name });
        }
        return {
          ...chat,
          users,
        };
      })
    );
    console.log(
      'ºº ~ file: ChatsUseCases.ts:160 ~ ChatsUseCases ~ getChatsByUserId ~ chats:',
      chats
    );
    return chats;
  }

  async __addUserToChat(params: {
    // If dont send chatId, its a new chat
    chatId: string;
    userId: string;
    isAdmin?: boolean;
  }): Promise<ChatEntity> {
    console.log('ºº ~ file: ChatsUseCases.ts:106 ~ ChatsUseCases ~', params);
    // let chat: ChatEntity;

    // if (params.chatId) {
    const chat = await this.chatsRepo.getById({
      chatId: params.chatId,
    });
    if (!chat) {
      throw new Error('addUserToChat: Chat not found');
    }

    await this.chatsUsersRepo.insert({
      chatId: params.chatId,
      userId: params.userId,
      isAdmin: params.isAdmin ?? undefined,
    });
    // } else {
    //   const chatId = getUuid();
    //   await this.chatsRepo.insert({ chatId, name });
    //   chat = new ChatEntity({ chatId });

    //   await this.chatsUsersRepository.insert({
    //     chatId: chatId,
    //     userId: params.userId,
    //   });
    //   // TODO: Mark as admin
    //   await this.chatsUsersRepository.insert({
    //     chatId: chatId,
    //     userId: params.userIdAdmin,
    //   });
    // }
    return chat;
  }

  async addUser(params: {
    chatId: string;
    userId: string;
    isAdmin?: boolean;
  }): Promise<ChatEntity> {
    let chat = await this.chatsRepo.getById({ chatId: params.chatId });
    if (!chat) {
      throw new Error('addUser: Chat not found');
    }

    const userIds: string[] = ChatTokenHelper.getUserIdsByChatToken(
      chat.chatToken
    );

    if (userIds.includes(params.userId)) {
      return chat;
    }

    userIds.push(params.userId);
    chat = new ChatEntity({
      chatId: params.chatId,
      name: chat.name,
      chatToken: ChatTokenHelper.getChatTokenByUserIds(userIds),
    });
    await this.chatsRepo.update(chat);

    await this.chatsUsersRepo.insert({
      chatId: params.chatId,
      userId: params.userId,
      isAdmin: params.isAdmin ?? undefined,
    });

    return chat;
  }

  async getMsgByIdAndUtc(params: ChatMsgEntityPkType): Promise<ChatMsgEntity> {
    return this.chatsMsgsRepo.getByIdAndUtc({
      chatId: params.chatId,
      utc: params.utc,
    });
  }

  async getMsgByIdLast(params: {
    chatId: string;
    limit: number;
  }): Promise<ChatMsgEntity[]> {
    console.log(
      'ºº ~ file: chats.use-cases.ts:58 ~ ChatsUseCases ~ chatId:',
      params.chatId
    );

    return this.chatsMsgsRepo.getByChatId(params);
  }

  async updateMsg(chat: Partial<ChatMsgEntity>) {
    return this.chatsMsgsRepo.update(chat);
  }
  async deleteMsg(pk: ChatMsgEntityPkType) {
    return this.chatsMsgsRepo.delete(pk);
  }

  isEmail(email: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  isUuid(uuid: string): boolean {
    const regexUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regexUuid.test(uuid);
  }
}
