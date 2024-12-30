// Importaciones necesarias
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler, Context, Callback } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';

import { EnvEnum } from 'elo/back/core/Shared';
import { ChatsAddMsg } from 'elo/back/core/Chats/UseCases';
import { ChatMsgEntity } from 'elo/back/core/Chats/Model';
import { ChatsProvidersTokens } from './Chats';
import { AppModule } from './App/AppModule';
import { AppProvidersTokens } from './App/AppProvidersTokens';
import { MsgDispacher } from './App/UseCases';

let expressInstance: Handler;
let corsEnabledUrl: string = '';
let nestApp: INestApplicationContext | null = null;

async function boostrap(): Promise<Handler> {
  const app = express();
  nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app), {
    logger: ['error', 'warn'],
  });

  const configService = nestApp.get(ConfigService);
  corsEnabledUrl = configService.get<string>(EnvEnum.corsEnabledUrl);
  console.log(
    'ºº ~ file: mainLambda.ts:23 ~ boostrap ~ corsEnabledUrl:',
    corsEnabledUrl,
    EnvEnum.corsEnabledUrl
  );

  await nestApp.init();

  // Crear la instancia de serverlessExpress
  return serverlessExpress({ app });
}

async function ensureExpressInstance(): Promise<Handler> {
  if (!expressInstance) {
    console.log('BOOSTRAP: INIT');
    expressInstance = await boostrap();
    console.log('BOOSTRAP: END');
  }
  return expressInstance;
}

async function httpEvent(
  event: any,
  context: Context,
  callback: Callback,
  expressInstance: any
) {
  const result = await expressInstance(event, context, callback);

  const headers = {
    'Access-Control-Allow-Origin': corsEnabledUrl,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('ºº ~ file: mainLambda.ts:58 return ', {
      statusCode: 200,
      headers,
      body: '',
    });
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Resto de la lógica de la función
  try {
    result.headers = {
      ...result.headers,
      headers,
    };

    console.log('ººRETURN', result);
    return result;
  } catch (error) {
    console.error('ººERROR', error);
    throw error;
  }
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  console.log('ºº elo-server mainLambda HANDLER v. {ELOCUENCY_AUTO_VERSION}', {
    // event,
    // context,
  });

  const instance = await ensureExpressInstance();

  if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
    const results = [];
    for (const record of event.Records) {
      if (!record.body) {
        console.error('ººError: SQS message has no body');
        results.push({ statusCode: 400, body: 'Invalid message format' });
        continue;
      }

      let messageBody;
      try {
        messageBody = JSON.parse(record.body);
        // Handle SQS message
        console.log('ººHANDLER Received SQS message:', messageBody);

        const receiveMsg: MsgDispacher = nestApp.get(
          AppProvidersTokens.MsgDispacher
        );
        const chatMsg = messageBody as ChatMsgEntity;
        await receiveMsg.exec({ chatMsg });
      } catch (error) {
        console.error('Error parsing SQS message body:', error);
        results.push({ statusCode: 400, body: 'Invalid message format' });
        continue;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Mensajes procesados correctamente'),
    };
  } else if (event.requestContext.http) {
    // Handle HTTP request
    console.log(
      'ººHANDLER Received HTTP request:',
      event.requestContext.http.path
    );
    try {
      return httpEvent(event, context, callback, instance);
    } catch (error) {
      console.error('Error handling HTTP request:', error);
      throw error;
    }
  } else {
    console.log('ººHANDLER Unknown event source ' + JSON.stringify(event));
  }
};
