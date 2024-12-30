import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ConflictException,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';

import { UsersUseCases } from 'elo/back/core/Users/UserCases';
import { UserEntity } from 'elo/back/core/Users/Model';
import { EloPublicRoute } from '../../Auth/UseCases';
import { UsersProvidersTokens } from '../UsersProvidersTokens';

type SendPushSubcriptionBodyType = {
  userId: string;
  pushSubscription: string;
};
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    @Inject(UsersProvidersTokens.UsersUseCases)
    private readonly usersUseCase: UsersUseCases
  ) {}

  @Get(':userId')
  @ApiResponse({ type: UserEntity })
  async get(@Param('userId') userId: string): Promise<UserEntity> {
    const resp = await this.usersUseCase.getById({ userId });
    console.log(
      'ºº ~ file: users.controller.ts:27 ~ UsersController ~ getUser ~ resp:',
      resp
    );
    return resp;
  }

  @Get('/by-email/:email')
  @ApiResponse({ type: UserEntity })
  async getByEmail(@Param('email') email: string): Promise<UserEntity> {
    const resp = await this.usersUseCase.getByEmail({ email });
    console.log(
      'ºº ~ file: users.controller.ts:27 ~ UsersController ~ getUser ~ resp:',
      resp
    );
    return resp;
  }

  @Put()
  @ApiBody({ type: PartialType(UserEntity) })
  async update(@Body() userData: Partial<UserEntity>): Promise<void> {
    this.usersUseCase.update(userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.usersUseCase.delete(id);
  }

  @Post()
  @EloPublicRoute()
  @ApiBody({ type: UserEntity })
  async insert(@Body() user: UserEntity) {
    console.log(
      'ºº ~ file: users.c   ontroller.ts:77 ~ UsersController ~ insert ~ UserEntity:',
      user
    );
    try {
      await this.usersUseCase.insert(user);
    } catch (error) {
      console.log(
        'ºº ~ file: users.controller.ts:88 ~ UsersController ~ insert ~ error:',
        error
      );
      if (error instanceof ConflictException) {
        throw new HttpException(
          `User with email already exists`,
          HttpStatus.CONFLICT
        );
      }
      throw error;
    }
  }

  /*
  @Post()
  @ApiBody({ type: UserEntity })
  async sendPushSubcription(@Body() body: SendPushSubcriptionBodyType) {
    console.log(
      'ºº ~ file: users.controller.ts:77 ~ UsersController ~ update ~ UserEntity:',
      body
    );
    try {
      await this.usersUseCase.update(body);
    } catch (error) {
      console.log(
        'ºº ~ file: users.controller.ts:88 ~ UsersController ~ insert ~ error:',
        error
      );
      if (error instanceof ConflictException) {
        throw new HttpException(
          `User with email already exists`,
          HttpStatus.CONFLICT
        );
      }
      throw error;
    }
  }
    */
}
