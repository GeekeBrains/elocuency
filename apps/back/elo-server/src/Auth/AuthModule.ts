import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../Auth/Controllers';
import {
  AuthUseCases,
  FirebaseCheckToken,
  JwtStrategy,
} from '../Auth/UseCases';
import { AdaptersModule } from 'elo/back/core/Adapters/index';
import { AuthProvidersTokens } from '../Auth/Ports';
import { UsersProvidersTokens } from '../Users';
import { UsersModule } from '../Users';
import { UsersUseCases } from 'elo/back/core/Users/UserCases';
import { EnvEnum } from 'elo/back/core/Shared';

// import { AdaptersProvidersTokens } from '../AdaptersProvidersTokens';
@Module({
  imports: [
    AdaptersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(
          'authJwtSecret: ',
          configService.get<string>(EnvEnum.authJwtSecret)
        );

        return {
          global: true,
          secret: configService.get<string>(EnvEnum.authJwtSecret),
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    FirebaseCheckToken,
    ConfigService,

    // Use Cases
    {
      provide: AuthProvidersTokens.AuthUseCases,
      useFactory: (
        usersUseCases: UsersUseCases,
        jwtService: JwtService,
        firebaseCheckToken: FirebaseCheckToken
      ) => {
        return new AuthUseCases(usersUseCases, jwtService, firebaseCheckToken);
      },
      inject: [
        UsersProvidersTokens.UsersUseCases,
        JwtService,
        FirebaseCheckToken,
      ],
    },
  ],
  exports: [],
})
export class AuthModule {}
