import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

import { ChatMsgEntity } from 'elo/back/core/Chats/Model';
import { QueueChatMsgPort } from 'elo/back/core/Chats/Ports';
import { getEnv, InfraEnum } from 'elo/back/core/Shared';
import { getAwsConfig } from 'elo/back/core/Shared/getAwsConfig';

const QUEUE_URL_ELO_SERVER = `https://localhost.localstack.cloud:4566/000000000000/${
  getEnv().infraPrefix
}elo-server`;
// const QUEUE_URL_SEND =
//   'https://sqs.<REGION>.amazonaws.com/<ACCOUNT_ID>/ServiceBToServiceAQueue';

const QUEUE_URL_ELO_LANGUAGE = `https://localhost.localstack.cloud:4566/000000000000/${
  getEnv().infraPrefix
}language-teacher-agent`;
// const sqsClient = new SQSClient({ region: '<REGION>' });

const sqsClient = new SQSClient(getAwsConfig());

export class QueueChatMsgAwsSqsAdapter implements QueueChatMsgPort {
  async send(params: {
    chatMsg: ChatMsgEntity;
    serviceTo: string;
  }): Promise<void> {
    let querUrl = '';
    if (params.serviceTo === 'elo-server') {
      querUrl = QUEUE_URL_ELO_SERVER;
    } else if (params.serviceTo === 'A-language-teacher') {
      querUrl = QUEUE_URL_ELO_LANGUAGE;
    } else {
      throw new Error(
        'QueueChatMsgAwsSqsAdapter - Service unknow: ' + params.serviceTo
      );
    }
    // console.log(
    //   'ºº ~ file: QueueChatMsgAwsSqsAdapter.ts:19 ~ QueueChatMsgAwsSqsAdapter ~ params:',
    //   { querUrl, params }
    // );

    const sendParams = {
      QueueUrl: querUrl,
      MessageBody: JSON.stringify(params.chatMsg),
    };

    try {
      await sqsClient.send(new SendMessageCommand(sendParams));
      console.log('Mensaje enviado a Servicio B:', params);
    } catch (error) {
      console.error('Error al enviar mensaje a Servicio B:', error);
      throw error;
    }
  }

  // async receive(): Promise<ChatMsgEntity | null> {
  //   const params = {
  //     QueueUrl: QUEUE_URL_SEND,
  //     MaxNumberOfMessages: 1,
  //     WaitTimeSeconds: 10, // Long Polling
  //   };

  //   try {
  //     const response = await sqsClient.send(new ReceiveMessageCommand(params));
  //     const messages = response.Messages;

  //     if (messages && messages.length > 0) {
  //       const message = messages[0];
  //       await sqsClient.send(
  //         new DeleteMessageCommand({
  //           QueueUrl: QUEUE_URL_SEND,
  //           ReceiptHandle: message.ReceiptHandle,
  //         })
  //       );
  //       console.log('Mensaje recibido de Servicio B:', message.Body);
  //       return JSON.parse(message.Body) as ChatMsgEntity;
  //     } else {
  //       console.log('No hay mensajes en la cola de Servicio B.');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Error al recibir mensaje de Servicio B:', error);
  //     throw error;
  //   }
  // }
}
