import { Controller, Post, Body, Res, Inject } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  AuthExternalLoginParamsType,
  AuthLoginParamsType,
  AuthUseCases,
  EloPublicRoute,
} from '../../Auth/UseCases';
import { UserEntity } from 'elo/back/core/Users/Model';
import { AuthProvidersTokens } from '../../Auth/Ports';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(AuthProvidersTokens.AuthUseCases)
    private readonly authUseCase: AuthUseCases
  ) {}

  @EloPublicRoute()
  @Post('external-login')
  @ApiBody({ type: AuthExternalLoginParamsType })
  @ApiResponse({ type: UserEntity })
  async externalLogin(
    @Body() params: AuthExternalLoginParamsType,
    @Res({ passthrough: true }) response: Response
  ) {
    console.log(
      'ºº ~ file: AuthController.ts:26 ~ AuthController ~ params:',
      params
    );

    const user = await this.authUseCase.externalLogin(params);
    if (user) {
      console.log(
        'ºº ~ file: AuthController.ts:28 ~ HAS! user:',
        user,
        process.env.NODE_ENV
      );

      response.cookie('sessionToken', user.sessionToken, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production', // secure: true on production
        sameSite: 'lax', // Allows the cookie to be sent in cross-site requests 'strict',
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      });
      console.log('has user');
      response.status(200).json(user);
      console.log('has user2');
      return;
    }

    response.status(404).json({ message: 'User not found' });
  }

  @EloPublicRoute()
  @Post('login')
  @ApiBody({ type: AuthLoginParamsType })
  @ApiResponse({ type: UserEntity })
  async login(@Body() params: AuthLoginParamsType): Promise<UserEntity | null> {
    console.log(
      'ºº ~ file: users.controller.ts:55 ~ UsersController ~ params:',
      params
    );
    return await this.authUseCase.login(params);
  }
}
