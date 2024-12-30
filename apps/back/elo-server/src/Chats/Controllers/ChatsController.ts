import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
} from '@nestjs/common';

import { ChatEntity } from 'elo/back/core/Chats/Model';
import { ChatRespDto, ChatsUseCases } from 'elo/back/server/Chats/UseCases';
import { PushToFrontMsgWebPushApiAdapter } from 'elo/back/core/Adapters/Adapters';
import { ChatsAddMsg } from 'elo/back/core/Chats/UseCases';
import { AppProvidersTokens } from 'elo/back/server/App/AppProvidersTokens';
import { ChatsProvidersTokens } from '../ChatsProvidersTokens';
import { IsOptional } from 'class-validator';

class AddByUsersParams {
  @ApiProperty()
  chatName: string;

  @ApiProperty()
  userIdAdmin: string;

  @ApiProperty()
  userKey: string;
}

class AddUserParams {
  @ApiProperty()
  chatId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsOptional()
  isAdmin?: boolean;
}

@Controller('chats')
@ApiTags('Chats')
export class ChatsController {
  constructor(
    @Inject(ChatsProvidersTokens.ChatsUseCases)
    private readonly chatsUseCases: ChatsUseCases
  ) {}

  // @Post('/add-msg')
  // async addMsg(@Body() chatMsg: ChatMsgEntity) {
  //   this.chatsAddMsgUc.exec({ chatMsg });
  // }

  @Post('/add-by-users')
  @ApiResponse({ type: ChatEntity })
  async addByUsers(@Body() params: AddByUsersParams): Promise<ChatEntity> {
    return this.chatsUseCases.addByUsers(params);
  }

  @Post('/add-user')
  async addUser(@Body() params: AddUserParams): Promise<void> {
    this.chatsUseCases.addUser(params);
  }

  @Get('/get-chats-by-user:userId')
  @ApiResponse({ type: ChatRespDto, isArray: true })
  async getChatsByUser(
    @Param('userId') userId: string
  ): Promise<ChatRespDto[]> {
    return this.chatsUseCases.getChatsByUserId({
      userId,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.chatsUseCases.get(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChatDto: Partial<ChatEntity>
  ) {
    return this.chatsUseCases.update(updateChatDto);
  }

  @Delete(':chatId')
  async delete(@Param('chatId') chatId: string) {
    return this.chatsUseCases.delete({ chatId });
  }
}
