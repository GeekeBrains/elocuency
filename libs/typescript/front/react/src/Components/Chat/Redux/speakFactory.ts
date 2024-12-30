import { ReducerCreators } from '@reduxjs/toolkit';
import { ChatSlideType } from '.';
import { WordLangEnum } from 'elo/back/server/open-api';
import { getSpeechVoice } from '../../../Shared/SpeechRecognitionHelper';

export const speakFactory = (reducerApi: ReducerCreators<ChatSlideType>) => {
  return reducerApi.asyncThunk(
    async (params: { text: string; langId: WordLangEnum }, thunkApi) => {
      const state = thunkApi.getState() as ChatSlideType;
      console.log('ºº ~ file: chatReducer.ts:153 ~ state:', state);

      const utterance = new SpeechSynthesisUtterance(params.text);
      utterance.voice = getSpeechVoice(params.langId, state.langsSpeechVoice);
      utterance.lang = params.langId + '-' + params.langId.toUpperCase();
      console.log(
        'ºº ~ file: chat-board.view-controller.ts:50 ~ speak ~ utterance:',
        utterance
      );

      window.speechSynthesis.speak(utterance);
    }
  );
};
