import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersUseCases } from 'elo/back/core/Users/UserCases';
import { UsersController } from './Controllers';
import { AdaptersModule } from 'elo/back/core/Adapters/index';
import { UsersRepoPort } from 'elo/back/core/Users/Ports';
import { UsersRepoDynamoDb } from 'elo/back/server/Users/Adapters/RepoDynamoDb';
import { UsersProvidersTokens } from './UsersProvidersTokens';

@Module({
  imports: [AdaptersModule],
  controllers: [UsersController],
  providers: [
    // Use Cases
    {
      provide: UsersProvidersTokens.UsersUseCases,
      useFactory: (usersRepository: UsersRepoPort) => {
        return new UsersUseCases(usersRepository);
      },
      inject: [UsersProvidersTokens.UsersRepository],
    },

    // {
    //   provide: UsersProvidersTokens.UsersInitVocabularyUseCase,
    //   useFactory: (
    //     usersWordTransRepository: UsersWordsTransRepositoryPort,
    //     wordsTransUseCases: WordsTransUseCases
    //   ) => {
    //     return new UsersInitVocabularyUseCase(
    //       usersWordTransRepository,
    //       wordsTransUseCases
    //     );
    //   },
    //   inject: [
    //     UsersProvidersTokens.UsersWordsTransRepository,
    //     WordsProvidersTokens.WordsTransUseCases,
    //   ],
    // },

    // Repositories
    {
      provide: UsersProvidersTokens.UsersRepository,
      useFactory: () => {
        return new UsersRepoDynamoDb();
      },
    },
    ConfigService,
  ],
  exports: [UsersProvidersTokens.UsersUseCases],
})
export class UsersModule {}
