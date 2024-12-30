'use client';

import {
  getEnv,
  EloLocalStorage,
  EloLocalStorageItemsEnum,
  getOpenApiConfig,
} from '../../../Shared';
import {
  PayloadAction,
  ReducerCreators,
  asyncThunkCreator,
  buildCreateSlice,
} from '@reduxjs/toolkit';

import {
  ChatEntity,
  ChatMsgEntity,
  ChatRespDto,
  ChatsApi,
  UserEntity,
  WordLangEnum,
} from 'elo/back/server/open-api';

import { loadChatMsgsFactory } from './loadChatMsgsFactory';
import { loadChatsFactory } from './loadChatsFactory';
import { addChatByUsersFactory } from './addChatByUsersFactory';
import { addChatToBoardFactory } from './addChatToBoardFactory';
import { setSpeechVoiceFactory } from './setSpeechVoiceFactory';
import { loadSpeechVoicesFactory } from './loadSpeechVoicesFactory';
import { speakFactory } from './speakFactory';
import { sendChatMsgsFactory } from './sendChatMsgFactory';
import { addChatMsgToBoardFactory } from './addChatMsgToBoardFactory';
import { setChatFactory } from './setChatFactory';
import { addUserToChatFactory } from './addUserToChatFactory';

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type LangsSpeechVoiceType = {
  [key in WordLangEnum]: { voiceName: string };
};

export type ChatSlideType = {
  chats: ChatEntity[];
  msgs: ChatMsgEntity[];
  langsSpeechVoice: LangsSpeechVoiceType;
  chat: ChatRespDto;
  // speech: {
  //   englishVoice?: SpeechSynthesisVoice;
  //   spanishVoice?: SpeechSynthesisVoice;
  // };
  // token?: string;
  // timer: {
  //   time?: number;
  //   reset?: boolean;
  // };
};

let chatsApi: ChatsApi;
let user: UserEntity = {} as UserEntity;

const initialAsyncState = (): ChatSlideType => {
  const locaUser = EloLocalStorage.getObject(EloLocalStorageItemsEnum.user);
  if (locaUser) {
    user = locaUser as UserEntity;
    getEnv().sessionToken = user.sessionToken as string;
    chatsApi = new ChatsApi(getOpenApiConfig());
  }
  const chats: ChatEntity[] =
    EloLocalStorage.getObject(EloLocalStorageItemsEnum.chats) || [];

  const chat: ChatRespDto =
    EloLocalStorage.getObject(EloLocalStorageItemsEnum.chat) || [];

  return {
    msgs: [],
    chats: chats,
    chat: chat,
    langsSpeechVoice: {} as LangsSpeechVoiceType,
  };
};

const chatSlice = createAppSlice({
  name: 'chat',
  initialState: initialAsyncState(),
  reducers: (reducerApi) => ({
    addChatMsgToBoard: reducerApi.reducer<ChatMsgEntity>(
      addChatMsgToBoardFactory
    ),

    setChat: reducerApi.reducer<ChatRespDto>(setChatFactory),

    addChatToBoard: addChatToBoardFactory(reducerApi),

    setSpeechVoice: setSpeechVoiceFactory(reducerApi),

    sendChatMsg: reducerApi.asyncThunk(sendChatMsgsFactory),

    addUserToChat: reducerApi.asyncThunk(addUserToChatFactory),

    loadChatMsgs: reducerApi.asyncThunk(loadChatMsgsFactory),

    loadChats: loadChatsFactory(reducerApi, chatsApi, user),

    addChatByUsers: addChatByUsersFactory(reducerApi, chatsApi, user),

    loadSpeechVoices: loadSpeechVoicesFactory(reducerApi),

    speak: speakFactory(reducerApi),
  }),
});

export const onChangeUserForChats = (action: PayloadAction) => {
  // console.log('ºº ~ file: chatReducer.ts:89 ~ MIDDLEWARE EVENT:', action);

  user = action.payload as unknown as UserEntity;
  getEnv().sessionToken = user.sessionToken as string;
  chatsApi = new ChatsApi(getOpenApiConfig());
};

export const chatReducer = chatSlice.reducer;

export const {
  addChatMsgToBoard,
  addChatToBoard,
  sendChatMsg,
  loadChatMsgs,
  setSpeechVoice,
  loadSpeechVoices,
  addChatByUsers,
  addUserToChat,
  loadChats,
  setChat,
} = chatSlice.actions;

/*
    if (!chatId || user.id === anonimousUser.id) {
      console.error('chatId null!!');
      return;
    }
    console.log(
      'ºº ~ file: app.tsx:243 ~ processesUserResponse ~ userText:',
      userText
    );

    setWaiting(true);

    // setGglobalState.timer.reset;
    const resp = await apiPost('/chats/' + chatId + '/msgs', {
      text: userText,
      userId: user.id,
      langId: 'es',
      type: 'text',
      // speechRecognitionResults,
    });
    if (resp.data) {
      const msgsClone = JSON.parse(JSON.stringify(msgs));
      msgsClone.push({ text: userText, userId: user?.id });
      for (const msgResp of resp.data) {
        const msg = msgResp;
        // Active timer? 
        if (msgResp.wordNumberTarget) {
          setActiveTimer(true);
          setWordNumberTarget(msgResp.wordNumberTarget);
          setWordNumberOk(msgResp.wordNumberOk);
        } else {
          setActiveTimer(false);
          setWordNumberTarget(0);
          setWordNumberOk(0);
        }

        if (msgResp.emotionalResponse === 'ok') {
          // Response Ok 
          const nextGlobalCountOk = globalCountOk + 1;
          setGlobalCountOk(nextGlobalCountOk);
          if (
            nextGlobalCountOk > 0 &&
            nextGlobalCountOk % DIVISIBLE_TO_PRIZE === 0
          ) {
            // Bonus 
            msg.userId = 'botPrize';
            msg.prize = nextGlobalCountOk;
            msg.emotion = 'ok3';
          } else {
            msg.emotion = 'ok1';
          }
        } else if (msgResp.emotionalResponse === 'ko') {
          // Emotional Ko 
          msg.emotion = 'ko1';
        } else {
          // No emotional! 
        }

        // Close session? 
        if (msgResp.command === 'session.close') {
          msgResp.commandFunc = commandSessionClose;
        }

        msgsClone.push(msg);
      }

      console.log('msgs', { msgs, msgsClone });
      setMsgsAux(msgsClone);
      setWaiting(false);
    }*/
