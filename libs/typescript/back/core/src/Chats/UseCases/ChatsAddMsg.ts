import { Injectable } from '@nestjs/common';

import {
  ChatMsgEntity,
  ChatMsgEmotionalTypesEnum,
  ChatMsgTypesEnum,
} from 'elo/back/core/Chats/Model';
import { ChatsMsgsRepoPort } from 'elo/back/core/Chats/Ports';
// import {
//   LearnFlowVocabUseCase,
//   TopicsFlowShowWordsUseCase,
// } from 'Elo/Agents/EloLanguage/UseCases';
import { PushToFrontMsgPort } from 'elo/back/core/Chats/Ports';
import {
  ChatTokenHelper,
  getUtcIso,
  StringUtils,
  WordLangEnum,
} from 'elo/back/core/Shared';
import { UserEntity } from 'elo/back/core/Users/Model';
import { UsersUseCases } from '../../Users/UserCases/UsersUseCases';

const WORD_TO_ASK_SUCCESS_LIMIT = 1;
const WORD_TO_ASK_FRECUENCY_TARGET = 3;
const WORD_TO_ASK_FRECUENCY_ORDER_LIMIT = 5;
const WORD_TO_SHOW = 4;

const banderas = {
  España: '&#x1F1EA;&#x1F1F8',
  Francia: '&#x1F1EB;&#x1F1F7',
  ReinoUnido: '&#x1F1EC;&#x1F1E7',
  Italia: '&#x1F1EE;&#x1F1F9',
};
interface AddBotMsgParamsCommand {
  service: string;
  method: string;
  params?: { [key: string]: any };
}

type VoiceType = {
  rate?: number;
  mute?: boolean;
};

interface AddBotMsgParams {
  voice?: VoiceType;
  command?: AddBotMsgParamsCommand;
  callback?: AddBotMsgParamsCommand;
  context?: object;
  targetWordsCount?: number;
  okWordsCount?: number;
  emotionalResponse?: ChatMsgEmotionalTypesEnum;
  hideText?: boolean;
  type?: ChatMsgTypesEnum;
}

export enum ChatsContextKeyEnum {
  topic = 'topic',
  word = 'word',
}

@Injectable() // { scope: Scope.REQUEST })
export class ChatsAddMsg {
  private lastDbMsgs: ChatMsgEntity[] = [];
  private lastDbMsg: ChatMsgEntity;
  private lastReceivedMsg: ChatMsgEntity;
  private newMsgs: ChatMsgEntity[] = [];
  // private currentFlowName: string; // TODO: change for currentFlowName
  private user: UserEntity;
  private chatId: string;
  private lastSequenceNo: number;

  constructor(
    private readonly usersUseCases: UsersUseCases,
    private readonly chatsMsgsRepository: ChatsMsgsRepoPort,
    private readonly pushToFrontMsgPort: PushToFrontMsgPort // private readonly topicsFlowShowWordsUseCase: TopicsFlowShowWordsUseCase // Flows // private readonly learnFlowVocabUseCase: LearnFlowVocabUseCase
  ) {}

  async exec(params: { chatMsg: ChatMsgEntity }) {
    console.log('ChatsAddMsg --------------------------------------');
    let userIds = ChatTokenHelper.getUserIdsByChatToken(
      params.chatMsg.chatToken
    );
    userIds = userIds.filter((item) => item !== params.chatMsg.userId);
    this.lastReceivedMsg = params.chatMsg;

    for (const userId of userIds) {
      if (userId.substring(0, 1) === 'A-') {
        continue;
      } else {
        this.user = await this.usersUseCases.getById({ userId });
        if (this.user.pushSubscriptionRaw) {
          const pushSubscription = JSON.parse(
            this.user.pushSubscriptionRaw
          ) as object;
          const msg: ChatMsgEntity = {
            body: params.chatMsg.body,
            chatId: params.chatMsg.chatId,
            userId: params.chatMsg.userId,
            chatToken: params.chatMsg.chatToken,
            utc: getUtcIso(),
            langId: WordLangEnum.es,
            type: ChatMsgTypesEnum.text,
          };

          this.pushToFrontMsgPort.push(pushSubscription, msg);
        } else {
          console.error('User without pushSubscriptionRaw: ' + userId);
        }
      }
    }

    /* ------------------------------------------------------------------------
    console.log(
      'ºº ~ file: ChatsRespGeneratorUseCase.ts:88 ~ ChatsRespGeneratorUseCase ~ this.user:',
      this.user.email
    );
    // this.currentFlowName = this.user.flowName;
    const chatMsg = new ChatMsgEntity({
      ...params.chatMsg,
      // flowName: this.currentFlowName,
    });

    this.chatId = params.chatMsg.chatId;
    this.lastReceivedMsg = chatMsg;

    // TODO: Optimize this, get only last msgs.
    this.lastDbMsgs = await this.chatsMsgsRepository.getAllByChatId({
      chatId: params.chatMsg.chatId,
      limit: 3,
    });
    console.log(
      'ºº ~ file: chat-reponse-generator.ts:96 ~ ChatsResponseGenerator ~ lastMsgs:',
      this.lastDbMsgs
    );

    if (this.lastDbMsgs.length > 0) {
      this.lastDbMsg = this.lastDbMsgs[this.lastDbMsgs.length - 1];
    } else {
      this.lastDbMsg = new ChatMsgEntity();
    }
    console.log(
      'ºº ~ file: chat-reponse-generator.ts:106 ~ ChatsResponseGenerator ~ this.lastDbMsg:',
      this.lastDbMsg
    );

    this.lastReceivedMsg.utc = getUtcIso();
    await this.chatsMsgsRepository.insert(this.lastReceivedMsg);
    this.lastDbMsgs.push(this.lastReceivedMsg);

    // const response = await this.aiApi.getAnswer(chatMsg.text);

    const firstCharacter = this.lastReceivedMsg.body.substring(0, 1);
    console.log(
      'ºº ~ file: chat-reponse-generator.ts:103 ~ ChatsResponseGenerator ~ firstCharacter:',
      firstCharacter
    );

    if (firstCharacter === '!') {
      await this.execTextCommand({ text: this.lastReceivedMsg.body });
    } else {
      // Continue flow
      const command = this.lastDbMsg?.command;
      const service = command?.substring(0, command.indexOf('.'));
      console.log(
        'ºº ~ file: ChatsRespGeneratorUseCase.ts:139 ~ ChatsRespGeneratorUseCase ~ command:',
        { command, service }
      );
      if (command) {
        await this.evalAndAwait(`this.${service}.init(this);`);
        await this.evalAndAwait(`this.${command};`);
      } else {
        await this.sendMsg({
          body: 'Me he perdido. ¿De qué estabamos hablando?',
          langId: WordLangEnum.es,
        });
      }
    }

    return this.newMsgs;
    */
  }

  async evalAndAwait(evalString: string) {
    console.log('evalAndAwait: ', evalString);
    // This change de scope of the var to globals. If not the eval make local vars.
    // const myEval = eval;
    try {
      await eval(evalString);
    } catch (e) {
      console.error(e);
    }
  }

  async execCommand(params: { command: string }): Promise<boolean> {
    const command = this.lastReceivedMsg.body.substring(1).trim();
    const flow = command.substring(0, command.indexOf('.'));
    console.log('execCommand', { flow, command });
    await this.evalAndAwait('this.' + flow + '.init(this)');
    await this.evalAndAwait('this.' + command);

    return true;
  }

  async execTextCommand(params: { text: string }): Promise<boolean> {
    // Parse direct command
    if (params.text.indexOf('!') === 0 && params.text.indexOf('(') > 3) {
      await this.execCommand({ command: params.text });
      return true;
    }

    // Parse user friendly command
    const doubleDotPos = params.text.indexOf(':');
    let command = '';
    let commandParams = [];
    if (doubleDotPos > 0) {
      command = params.text.substring(0, params.text.indexOf(':'));
      commandParams = params.text.substring(+1).trim().split(',');
    } else {
      command = params.text;
    }
    console.log(
      'ºº ~ file: chat-reponse-generator.ts:134 ~ ChatResponseGenerator ~ execTextCommand ~ command:',
      { command, commandParams }
    );

    /* TODO: Refactor this to 
      getCommand = (type: CommandsEnum)=> {
        return {
          [CommandsEnum.learn]: this.learnVocabularyFlowUseCase.init(this),
          [CommandsEnum.topics]: this.topicsFlowShowWordsUseCase.init(this),
        }[type];
      }
    */

    switch (command) {
      // case '!learn':
      //   await this.learnVocabularyFlowUseCase.init(this);
      //   await this.learnVocabularyFlowUseCase.startFlow();
      //   break;

      case '!learn topic':
        if (commandParams.length === 0) {
          await this.sendMsg({
            body: 'Falta el tema que quieres aprender.',
            langId: WordLangEnum.es,
          });
          break;
        }
        // await this.learnFlowVocabUseCase.init(this);
        // await this.learnFlowVocabUseCase.learnTopic({
        //   topicId: commandParams[0].trim(),
        // });
        break;

      // case '!topics':
      //   await this.topicsFlowShowWordsUseCase.init(this);
      //   await this.topicsFlowShowWordsUseCase.startFlow();
      //   break;

      default:
        await this.sendMsg({
          body: 'No te entiendo.',
          langId: WordLangEnum.es,
        });
    }
    return true;
  }

  async sendButton(text: string, command: AddBotMsgParamsCommand) {
    const langId = this.user.nativeLangId;
    return await this.sendMsg({
      body: text,
      langId,
      voice: { mute: true },
      command,
      type: ChatMsgTypesEnum.button,
    });
  }

  async sendMsgMute(text: string, langIdParam?: WordLangEnum) {
    const langId = langIdParam ?? this.user.nativeLangId;
    return await this.sendMsg({ body: text, langId, voice: { mute: true } });
  }

  async sendMsgTrans(
    text: string,
    langIdParam?: WordLangEnum,
    textParams?: any[],
    params?: AddBotMsgParams
  ) {
    /*
    const langId = langIdParam ?? this.user.nativeLangId;
    textParams = textParams ?? [];

    if (langId !== WordLangEnum.en) {
      const sentence = await this.sentenceRepository.find({
        where: { text, langId },
      });
      if (sentence[0]) {
        const textAux =
          await this.sentenceRelationRepository.getSentenceFromRelationById(
            sentence[0].id,
            WordLangEnum.en, // On code always in english.
            langId,
            SentenceRelationTypes.translate
          );

        text = textAux ? textAux : text;
        console.log('sendMsgTrans', text, sentence[0].id);
      } else {
        const newSentece = new Sentence();
        newSentece.langId = langId;
        newSentece.text = text;
        await this.sentenceRepository.save(newSentece);
        console.error('sendMsgTrans, cant saveByKey sentence.');
      }
    }

    for (const textParam of textParams) {
      text = text.replace('{s}', textParam);
    }

    await this.sendMsg(text, langId, params);
    */
  }

  async sendMsg(params: {
    toTransText?: string;
    body?: string;
    langId: WordLangEnum;
    type?: ChatMsgTypesEnum;
    // data?: any; //ChatMsgDataType;
    command?: AddBotMsgParamsCommand;
    callback?: AddBotMsgParamsCommand;
    voice?: VoiceType;
    emotionalResponse?: ChatMsgEmotionalTypesEnum;
    hidden?: boolean;
  }) {
    const msg = new ChatMsgEntity();
    // TODO: Translate the toTransText
    msg.body = params.body ?? params.toTransText;
    msg.type = params.type ?? ChatMsgTypesEnum.text;
    msg.langId = params.langId;
    msg.chatId = this.chatId;
    // msg.context = JSON.stringify({
    //   ...this.nextContextToSave,
    //   ...params?.context,
    // });
    // msg.flowName = this.currentFlowName;
    // if (params?.command) {
    //   msg.commandRaw = this.getComandString(params.command);
    // }
    msg.voice = params.voice ?? {};
    msg.userId = 'A-language-teacher';
    // msg.data = params.data;
    msg.emotionalResponse = params.emotionalResponse;
    msg.hidden = params.hidden ?? false;

    ++this.lastSequenceNo;
    msg.utc = getUtcIso();

    // console.log('ºº Seq no', msg.utc);
    this.newMsgs.push(msg);
    await this.chatsMsgsRepository.insert(msg);
  }

  async sendData(
    responseType: ChatMsgTypesEnum,
    data: any,
    params?: AddBotMsgParams
  ) {
    const msg = new ChatMsgEntity();

    // msg.data = data;
    msg.type = responseType;
    msg.chatId = this.chatId;
    // msg.flowName = this.currentFlowName;
    msg.userId = this.user.userId;
    msg.chatToken = 'TODO: !!!!';
    msg.langId = this.user.nativeLangId;
    // if (params?.command) {
    //   msg.commandRaw = this.getComandString(params.command);
    // }

    msg.utc = getUtcIso();
    console.log('addToQueue ', msg);
    this.newMsgs.push(msg);
    await this.chatsMsgsRepository.insert(msg);
  }

  private getComandString(command: AddBotMsgParamsCommand) {
    let parenthesisPart = command.method;
    let count = 0;
    if (command.params) {
      parenthesisPart += '({';
      for (const key in command.params) {
        if (command.params.hasOwnProperty(key)) {
          const param = command.params[key];

          if (count > 0) parenthesisPart += ',';

          if (typeof param === 'string') {
            parenthesisPart += key + ": '" + param + "' ";
          } else if (typeof param === 'object') {
            if (param.function) {
              parenthesisPart += param.function;
            } else {
              console.error('getComandString params type object unknown');
            }
          } else {
            parenthesisPart += key + ': ' + param;
          }
          ++count;
        }
      }
      parenthesisPart += '})';
    } else {
      parenthesisPart += '()';
    }

    return (
      StringUtils.getLowerFirstLetter(command.service) + '.' + parenthesisPart
    );
  }

  async addResultAndOtherPosibilities(
    answerIsCorrect: boolean,
    answerText: string,
    textFrom: string,
    textTo: string
  ) {
    if (answerIsCorrect) {
      if (answerText !== textTo) {
        await this.sendMsg({
          body: 'Ok, tambien podría ser:',
          langId: WordLangEnum.es,
          emotionalResponse: ChatMsgEmotionalTypesEnum.ok,
        });
        await this.sendMsg({ body: textTo, langId: WordLangEnum.en });
      } else {
        await this.sendMsg({
          body: 'Ok.',
          langId: WordLangEnum.es,
          emotionalResponse: ChatMsgEmotionalTypesEnum.ok,
        });
        await this.sendMsg({ body: answerText, langId: WordLangEnum.en });
      }
    } else {
      await this.sendMsg({
        body: `${textFrom}, podría ser:`,
        langId: WordLangEnum.es,
        emotionalResponse: ChatMsgEmotionalTypesEnum.failed,
      });
      await this.sendMsg({ body: textTo, langId: WordLangEnum.en });
    }
  }

  getLastReceivedMsg() {
    return this.lastReceivedMsg;
  }

  // getLastBotMsg() {
  //   return this.lastDbMsg;
  // }

  // setFlowName(value: string) {
  //   this.currentFlowName = value;
  // }

  getUser(): UserEntity {
    return this.user;
  }
}
