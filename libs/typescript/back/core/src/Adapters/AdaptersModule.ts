import { Module } from '@nestjs/common';
import { AdaptersProvidersTokens } from './AdaptersProvidersTokens';
import { createPool, Pool } from 'mysql2/promise';
import { QueueChatMsgAwsSqsAdapter } from './Adapters/QueueChatMsg';

@Module({
  providers: [
    // TODO: Send to env
    // {
    //   provide: AdaptersProvidersTokens.MySql2Client,
    //   useFactory: async (): Promise<Pool> => {
    //     const pool = createPool({
    //       host: '',
    //       user: 'root',
    //       password: '',
    //       database: 'elo-mysql',
    //       waitForConnections: true,
    //       connectionLimit: 10,
    //       queueLimit: 0,
    //     });
    //     return pool;
    //   },
    // },
    {
      provide: AdaptersProvidersTokens.QueueChatMsgAwsSqsAdapter,
      useFactory: async () => {
        return new QueueChatMsgAwsSqsAdapter();
      },
    },
    // useFactory: async (): Promise<Pool> => {
    //   const pool = createPool({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database: 'elo-mysql',
    //     waitForConnections: true,
    //     connectionLimit: 10,
    //     queueLimit: 0,
    //   });
  ],
  exports: [
    // AdaptersProvidersTokens.MySql2Client,
    AdaptersProvidersTokens.QueueChatMsgAwsSqsAdapter,
  ],
})
export class AdaptersModule {}
