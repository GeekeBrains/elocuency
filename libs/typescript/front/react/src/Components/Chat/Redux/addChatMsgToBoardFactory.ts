import { Draft } from '@reduxjs/toolkit';
import { ChatSlideType } from '.';
import { ChatMsgEntity } from 'elo/back/server/open-api';

export const addChatMsgToBoardFactory = (
  state: Draft<ChatSlideType>,
  action: { payload: ChatMsgEntity }
) => {
  state.msgs.push(action.payload);
};
