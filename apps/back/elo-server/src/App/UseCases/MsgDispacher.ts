import { Injectable } from '@nestjs/common';

import {
  PushToFrontMsgPort,
  QueueChatMsgPort,
} from 'elo/back/core/Chats/Ports';
import { ChatMsgEntity, ChatMsgTypesEnum } from 'elo/back/core/Chats/Model';
import { UsersUseCases } from 'elo/back/core/Users/UserCases';
import { ChatTokenHelper, getUtcIso, WordLangEnum } from 'elo/back/core/Shared';

@Injectable()
export class MsgDispacher {
  constructor(
    private readonly queueChatMsg: QueueChatMsgPort,
    private readonly usersUseCases: UsersUseCases,
    private readonly pushToFrontMsgPort: PushToFrontMsgPort
  ) {}

  async exec(params: { chatMsg: ChatMsgEntity }) {
    console.log('--------------------------------------');
    let userIds = ChatTokenHelper.getUserIdsByChatToken(
      params.chatMsg.chatToken
    );
    console.log(
      'ºº ~ file: MsgDispacher.ts:24 ~ MsgDispacher ~ exec ~ userIds:',
      userIds
    );
    userIds = userIds.filter((item) => item !== params.chatMsg.userId);

    for (const userId of userIds) {
      if (userId.startsWith('A-')) {
        console.log('    ººRESEND TO SERVICE:', userId);
        this.queueChatMsg.send({
          chatMsg: params.chatMsg,
          serviceTo: 'A-language-teacher',
        });

        continue;
      } else {
        console.log('    ººRESEND TO USER:', userId);
        const user = await this.usersUseCases.getById({ userId });
        if (user.pushSubscriptionRaw) {
          const pushSubscription = JSON.parse(
            user.pushSubscriptionRaw
          ) as object;

          this.pushToFrontMsgPort.push(pushSubscription, params.chatMsg);
        } else {
          console.error('User without pushSubscriptionRaw: ' + userId);
        }
      }
    }

    // const respMsg = new ChatMsgEntity({
    //   body: 'Que pasa tronko!',
    //   chatId: params.chatMsg.chatId,
    //   userId: 'A-language-teacher-agent',
    // });
    // console.log(
    //   'ºº ~ file: LanguageMsgDispacher.ts:13 ~ LanguageMsgDispacher ~ exec ~ respMsg:',
    //   respMsg
    // );
    // this.queueChatMsg.send({ chatMsg: respMsg, serviceTo: 'elo-server' });
  }
}
