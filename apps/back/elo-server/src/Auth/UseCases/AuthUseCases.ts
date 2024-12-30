import { ApiProperty } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcryptjs from 'bcryptjs';

import { getUuid, IsValid } from 'elo/back/core/Shared';
import { UserEntity } from 'elo/back/core/Users/Model';
import { FirebaseCheckToken } from './FirebaseCheckToken';
import { UsersUseCases } from 'elo/back/core/Users/UserCases';

export class AuthLoginParamsType {
  @ApiProperty()
  email = '';
  @ApiProperty()
  password = '';
}

export class AuthExternalLoginParamsType {
  @ApiProperty()
  email = '';
  @ApiProperty()
  name = '';
  @ApiProperty()
  avatarUrl = '';
  @ApiProperty()
  providerType = '';
  @ApiProperty()
  providerToken = '';
}

// export class AuthLoginResponseType  {
//   @ApiProperty()
//   id?: string;

//   @ApiProperty()
//   name?: string;

//   @ApiProperty()
//   sessionToken?: string;

//   @ApiProperty()
//   currentChatId?: string;

//   @ApiProperty()
//   nativeLangId?: string;

//   @ApiProperty()
//   targetLangId?: string;
// }

@Injectable()
export class AuthUseCases {
  constructor(
    private readonly usersUseCases: UsersUseCases,
    private readonly jwtService: JwtService,
    private readonly firebaseCheckToken: FirebaseCheckToken
  ) {}

  isValidUser(user: UserEntity) {
    return (
      user.email &&
      IsValid.email(user.email) &&
      user.name &&
      IsValid.password(user.password) &&
      user.nativeLangId &&
      user.targetLangId
    );
  }

  async login(params: {
    email: string;
    password: string;
  }): Promise<UserEntity | null> {
    console.log(
      'ºº ~ file: users.use-cases.ts:11 ~ UsersUseCase ~ login ~ id:',
      params
    );
    const user = await this.usersUseCases.getByEmail({ email: params.email });

    if (user && bcryptjs.compareSync(params.password, user.password)) {
      user.sessionToken = await this.jwtService.signAsync(
        {
          sub: user.userId,
          role: 'user',
        },
        { expiresIn: '7d' }
      );
      return user;
    } else {
      console.log('ºº ~ file: users.use-cases.ts:20 ~ user: BAD PASSWORD');
      return null;
    }
  }

  async externalLogin(
    params: AuthExternalLoginParamsType
  ): Promise<UserEntity | null> {
    const resp = await this.firebaseCheckToken.verifyToken(
      params.providerToken
    );
    console.log('ºº ~ file: AuthUseCases.ts:102 ~ AuthUseCases ~ resp:', resp);
    let user = await this.usersUseCases.getByEmail(params);
    if (!user) {
      user = new UserEntity({
        userId: getUuid(),
        email: params.email,
        name: params.name,
        avatarUrl: params.avatarUrl,
        externalLoginProviderType: params.providerType,
        currentChatId: getUuid(),
      });
      await this.usersUseCases.insert(user);
    }

    const ret = {
      ...user,
      sessionToken: await this.jwtService.signAsync(
        {
          sub: user.userId,
          role: 'user',
        },
        { expiresIn: '7d' }
      ),
    };

    console.log(
      'ºº ~ file: users.use-cases.ts:105 ~ UsersUseCases ~ ret:',
      ret
    );
    return ret;
  }
}
