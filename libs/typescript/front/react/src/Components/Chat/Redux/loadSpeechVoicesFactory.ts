import { ReducerCreators } from '@reduxjs/toolkit';
import { ChatSlideType, setSpeechVoice } from '.';
import { WordLangEnum } from 'elo/back/server/open-api';

export const loadSpeechVoicesFactory = (
  reducerApi: ReducerCreators<ChatSlideType>
) => {
  return reducerApi.asyncThunk(async (params: { text: string }, thunkApi) => {
    // const nativeVoice = user.nativeLangId;
    // const targetVoice = user.targetLangId;
    const speechSynthesis = window.speechSynthesis;

    // if (!nativeVoice || !targetVoice) {
    speechSynthesis.onvoiceschanged = function () {
      const abailableVoices = global.speechSynthesis.getVoices();
      // TODO: Refactor
      abailableVoices.forEach((currentVoice) => {
        const currentVoiceSimple = {
          voiceURI: currentVoice.voiceURI,
          name: currentVoice.name,
          lang: currentVoice.lang,
        };

        if (
          currentVoice.lang === 'es-ES' ||
          currentVoice.lang === 'fr-FR' ||
          currentVoice.lang === 'en-EN'
        ) {
          // console.log('Voz: ', currentVoice);
        }
        if (currentVoice.name === 'Google español') {
          thunkApi.dispatch(
            setSpeechVoice({
              langId: WordLangEnum.es,
              voiceName: currentVoice.name,
            })
          );
        }
        if (currentVoice.name === 'Google français') {
          thunkApi.dispatch(
            setSpeechVoice({
              langId: WordLangEnum.fr,
              voiceName: currentVoice.name,
            })
          );
        }
        if (currentVoice.name === 'Google UK English Male') {
          thunkApi.dispatch(
            setSpeechVoice({
              langId: WordLangEnum.en,
              voiceName: currentVoice.name,
            })
          );
        }
      });
      // };
    };
  });
};
