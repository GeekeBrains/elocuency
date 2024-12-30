import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Inject } from '@nestjs/common';

import { ChatMsgEntity } from 'elo/back/core/Chats/Model';
import { MsgDispacher } from '../UseCases';
import { AppProvidersTokens } from '../AppProvidersTokens';

@Controller('')
@ApiTags('Server')
export class AppController {
  constructor(
    @Inject(AppProvidersTokens.MsgDispacher)
    private readonly receiveMsg: MsgDispacher
  ) {}

  @Post('/receive-msg')
  async addMsg(@Body() chatMsg: ChatMsgEntity) {
    this.receiveMsg.exec({ chatMsg });
  }
}
