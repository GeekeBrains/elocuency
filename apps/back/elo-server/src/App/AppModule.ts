import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { createPool } from 'mysql2';
// import { APP_GUARD } from '@nestjs/core';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
// import { Pool } from 'mysql2/typings/mysql/lib/Pool';

import {
  AdaptersModule,
  AdaptersProvidersTokens,
} from 'elo/back/core/Adapters/index';
import { ChatsModule, ChatsProvidersTokens } from '../Chats';
import { UsersModule, UsersProvidersTokens } from '../Users';
import { AuthModule } from '../Auth';
import { EnvDef } from 'elo/back/core/Shared';
import { AppProvidersTokens } from './AppProvidersTokens';
import { UsersUseCases } from 'elo/back/core/Users/UserCases';
import {
  PushToFrontMsgWebPushApiAdapter,
  QueueChatMsgAwsSqsAdapter,
} from 'elo/back/core/Adapters/Adapters';
import { MsgDispacher } from './UseCases';
import { AppController } from './Controllers';
// import { JwtAuthGuard } from 'Elo/Auth/Guards';

@Module({
  imports: [
    AdaptersModule,
    UsersModule,

    // LanguageModule,
    ChatsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: async (config: Record<string, unknown>) => {
        const validatedConfig = plainToClass(EnvDef, config, {
          enableImplicitConversion: true,
        });
        // console.log(
        //   'ºº ~ file: AppModule.ts:52 ~ validate: ~ validatedConfig:',
        //   validatedConfig
        // );
        const errors = await validate(validatedConfig, {
          skipMissingProperties: false,
        });
        if (errors.length > 0) {
          throw new Error(
            `Configuration validation error: ${errors.toString()}`
          );
        }
        return validatedConfig;
      },
    }),
    // SubtitlesModule,
  ],
  controllers: [AppController],
  // Comment to disable global guard
  providers: [
    {
      provide: AppProvidersTokens.MsgDispacher,
      useFactory: (
        usersUseCases: UsersUseCases,
        pushToFrontMsgWebPushApiAdapter: PushToFrontMsgWebPushApiAdapter,
        queueChatMsgAwsSqsAdapter: QueueChatMsgAwsSqsAdapter
        // chatsMsgsRepository: ChatsMsgsRepoPort,
        // learnFlowVocabUseCase: LearnFlowVocabUseCase,
        // topicsFlowShowWordsUseCase: TopicsFlowShowWordsUseCase,
      ) => {
        return new MsgDispacher(
          queueChatMsgAwsSqsAdapter,
          usersUseCases,
          pushToFrontMsgWebPushApiAdapter
          // chatsMsgsRepository,
        );
      },
      inject: [
        UsersProvidersTokens.UsersUseCases,
        AppProvidersTokens.PushToFrontMsgWebPushApiAdapter,
        AdaptersProvidersTokens.QueueChatMsgAwsSqsAdapter,
        // ChatsProvidersTokens.ChatsMsgsRepo,
        // ChatsProvidersTokens.LearnFlowVocabUseCase,
        // ChatsProvidersTokens.TopicsFlowShowWordsUseCase,
      ],
    },
    {
      provide: AppProvidersTokens.PushToFrontMsgWebPushApiAdapter,
      useFactory: () => {
        return new PushToFrontMsgWebPushApiAdapter();
      },
    },

    // TODO: IMPORTANT: Uncomment to enable global guard
    //   {
    //     provide: APP_GUARD,
    //     useClass: JwtAuthGuard,
    //   },
  ],
})
export class AppModule {}
