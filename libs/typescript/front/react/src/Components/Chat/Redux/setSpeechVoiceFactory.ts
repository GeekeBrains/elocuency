import { ReducerCreators } from '@reduxjs/toolkit';
import { ChatSlideType } from '.';
import { WordLangEnum } from 'elo/back/server/open-api';

export const setSpeechVoiceFactory = (
  reducerApi: ReducerCreators<ChatSlideType>
) => {
  return reducerApi.reducer<{
    langId: WordLangEnum;
    voiceName: string;
  }>((state, action) => {
    if (!state.langsSpeechVoice[action.payload.langId]) {
      state.langsSpeechVoice[action.payload.langId] = {
        voiceName: action.payload.voiceName,
      };
    } else {
      state.langsSpeechVoice[action.payload.langId].voiceName =
        action.payload.voiceName;
    }
  });
};
