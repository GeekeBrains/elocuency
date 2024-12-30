import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ChatsUseCases } from 'elo/back/server/Chats/UseCases';
import { ChatMsgEntity } from 'elo/back/core/Chats/Model';
import { ChatsProvidersTokens } from '../ChatsProvidersTokens';

@Controller('chats')
@ApiTags('Chats')
export class ChatsMsgsController {
  constructor(
    @Inject(ChatsProvidersTokens.ChatsUseCases)
    private readonly chatsUseCases: ChatsUseCases
  ) {}

  @Post()
  async create(@Body() createChatDto: ChatMsgEntity) {
    return this.chatsUseCases.createMsg(createChatDto);
  }

  @Get(':chatId/msgs/last/:limit')
  async getMsgsByIdLast(
    @Param('chatId') chatId: string,
    @Param('limit') limit: number
  ) {
    console.log(
      'ºº ~ file: chats-msgs.controller.ts:32 ~ ChatsMsgsController ~ chatId:',
      chatId
    );
    return this.chatsUseCases.getMsgByIdLast({ chatId, limit: Number(limit) });
  }

  @Get(':id/msgs/:utc')
  async get(@Param('id') chatId: string, @Param('utc') utc: string) {
    console.log(
      'ºº ~ file: chats-msgs.controller.ts:28 ~ ChatsMsgsController ~ { chatId, utc } :',
      { chatId, utc }
    );
    return this.chatsUseCases.getMsgByIdAndUtc({ chatId, utc });
  }

  @Put(':id/msgs/:utc')
  async update(
    @Param('id') id: string,
    @Param('utc') utc: string,
    @Body() updateChatDto: Partial<ChatMsgEntity>
  ) {
    return this.chatsUseCases.updateMsg(updateChatDto);
  }

  @Delete(':chatId/msgs/:utc')
  async delete(@Param('chatId') chatId: string, @Param('utc') utc: string) {
    return this.chatsUseCases.deleteMsg({ chatId, utc });
  }
}
