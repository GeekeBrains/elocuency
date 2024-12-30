import { Module } from '@nestjs/common';

import { ChatsUseCases } from 'elo/back/server/Chats/UseCases';
import {
  ChatsRepoDynamoDbAdapter,
  ChatsMsgsRepoDynamoDbAdapter,
} from 'elo/back/server/Chats/Adapters/RepoDynamoDb';
import { UsersUseCases } from 'elo/back/core/Users/UserCases';
import { AdaptersModule } from 'elo/back/core/Adapters/index';
import { ChatsRepoPort, ChatsUsersRepoPort } from 'elo/back/server/Chats/Ports';
import { ChatsUsersRepoDynamoDbAdapter } from 'elo/back/server/Chats/Adapters/RepoDynamoDb';
import { ChatsMsgsRepoPort } from 'elo/back/core/Chats/Ports';
import { ChatsController, ChatsMsgsController } from '../Chats/Controllers';
import { UsersModule } from '../Users';
import { UsersProvidersTokens } from '../Users';
import { ChatsProvidersTokens } from './ChatsProvidersTokens';

@Module({
  imports: [UsersModule, AdaptersModule],
  controllers: [ChatsController, ChatsMsgsController],
  providers: [
    // Use cases
    {
      provide: ChatsProvidersTokens.ChatsUseCases,
      useFactory: (
        chatsRepo: ChatsRepoPort,
        chatsMsgRepo: ChatsMsgsRepoPort,
        chatsUsersRepo: ChatsUsersRepoPort,
        usersUseCases: UsersUseCases
      ) => {
        return new ChatsUseCases(
          chatsRepo,
          chatsMsgRepo,
          chatsUsersRepo,
          usersUseCases
        );
      },
      inject: [
        ChatsProvidersTokens.ChatsRepo,
        ChatsProvidersTokens.ChatsMsgsRepo,
        ChatsProvidersTokens.ChatsUsersRepo,
        UsersProvidersTokens.UsersUseCases,
      ],
    },
    // {
    //   provide: ChatsProvidersTokens.TopicsFlowShowWordsUseCase,
    //   useFactory: (
    //     topicsUseCases: TopicsUseCases,
    //     wordsTransUseCases: WordsTransUseCases,
    //     usersWordsTransTopicsUseCases: UsersWordsTransTopicsUseCases
    //   ) => {
    //     return new TopicsFlowShowWordsUseCase(
    //       topicsUseCases,
    //       wordsTransUseCases,
    //       usersWordsTransTopicsUseCases
    //     );
    //   },
    //   inject: [
    //     WordsProvidersTokens.TopicsUseCases,
    //     WordsProvidersTokens.WordsTransUseCases,
    //     UsersProvidersTokens.UsersWordsTransTopicsUseCases,
    //   ],
    // },
    // {
    //   provide: ChatsProvidersTokens.ChatsRespGeneratorUseCase,
    //   useFactory: (
    //     usersUseCases: UsersUseCases,
    //     chatsMsgsRepository: ChatsMsgsRepoPort,
    //     // learnFlowVocabUseCase: LearnFlowVocabUseCase,
    //     // topicsFlowShowWordsUseCase: TopicsFlowShowWordsUseCase,
    //     pushToFrontMsgWebPushApiAdapter: PushToFrontMsgWebPushApiAdapter
    //   ) => {
    //     return new ChatsAddMsg(
    //       usersUseCases,
    //       chatsMsgsRepository,
    //       pushToFrontMsgWebPushApiAdapter
    //       // learnFlowVocabUseCase,
    //       // topicsFlowShowWordsUseCase
    //     );
    //   },
    //   inject: [
    //     UsersProvidersTokens.UsersUseCases,
    //     ChatsProvidersTokens.ChatsMsgsRepo,
    //     // ChatsProvidersTokens.LearnFlowVocabUseCase,
    //     // ChatsProvidersTokens.TopicsFlowShowWordsUseCase,
    //     AppProvidersTokens.PushToFrontMsgWebPushApiAdapter,
    //   ],
    // },
    // {
    //   provide: ChatsProvidersTokens.LearnFlowVocabUseCase,
    //   useFactory: (usersWordsTransUseCases: UsersWordsTransUseCases) => {
    //     return new LearnFlowVocabUseCase(usersWordsTransUseCases);
    //   },
    //   inject: [UsersProvidersTokens.UsersWordsTransUseCases],
    // },

    // Repositories
    {
      provide: ChatsProvidersTokens.ChatsRepo,
      useFactory: () => {
        return new ChatsRepoDynamoDbAdapter();
      },
      inject: [],
    },
    {
      provide: ChatsProvidersTokens.ChatsMsgsRepo,
      useFactory: () => {
        return new ChatsMsgsRepoDynamoDbAdapter();
      },
      inject: [],
    },
    {
      provide: ChatsProvidersTokens.ChatsUsersRepo,
      useFactory: () => {
        return new ChatsUsersRepoDynamoDbAdapter();
      },
      inject: [],
    },
  ],
  exports: [
    // ChatsRespGeneratorUseCase
  ],
})
export class ChatsModule {}
