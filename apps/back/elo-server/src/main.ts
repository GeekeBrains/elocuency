import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cors from 'cors';

import { AppModule } from './App';
import { ConfigService } from '@nestjs/config';
import { EnvEnum } from 'elo/back/core/Shared';

async function boostrap() {
  console.log('ºº elo-server main HANDLER v. {ELOCUENCY_AUTO_VERSION}');

  const nestApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const configService = nestApp.get(ConfigService);
  const swagerUrl = 'api';
  const corsEnabledUrl = configService.get<string>(EnvEnum.corsEnabledUrl);
  const serverPort = configService.get<string>(EnvEnum.serverPort);

  const options = new DocumentBuilder()
    .setTitle('Elocuency BFF')
    .setDescription('Back for Elocuency App Frontend - Desktop config')
    .setVersion('1.0')
    // .addTag('etiqueta')
    // .addBearerAuth()
    .build();
  // console.log('ºº ~ file: main-dev.ts:16 ~ boostrap ~ options:', options);
  const document = SwaggerModule.createDocument(nestApp, options);
  SwaggerModule.setup(swagerUrl, nestApp, document);

  const corsOptions = {
    origin: [corsEnabledUrl],
    credentials: true,
  };

  nestApp.use(cors(corsOptions));
  nestApp.enableCors();
  await nestApp.listen(serverPort);
  console.log();
  console.log();
  console.log();
  console.log(
    `Application is running on: ${await nestApp.getUrl()} ---------------------------------------------`
  );
  console.log('Current working directory:', process.cwd());
}

boostrap();
