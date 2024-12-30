import { ReducerCreators } from '@reduxjs/toolkit';
import { ChatSlideType } from '.';
import { ChatEntity } from 'elo/back/server/open-api';

export const addChatToBoardFactory = (
  reducerApi: ReducerCreators<ChatSlideType>
) => {
  return reducerApi.reducer<ChatEntity>((state, action) => {
    console.log('ºº ~ file: chatSlide.ts:80 ~ action.payload:', action.payload);
    if (action.payload) {
      state.chats.push(action.payload);
    } else {
      state.chats = [];
    }
  });
};
