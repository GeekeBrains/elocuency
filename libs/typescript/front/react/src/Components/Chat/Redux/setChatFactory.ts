import { Draft } from '@reduxjs/toolkit';

import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
} from 'elo/front/react/Shared';
import { ChatRespDto } from 'elo/back/server/open-api';
import { ChatSlideType } from '.';

export const setChatFactory = (
  state: Draft<ChatSlideType>,
  action: { payload: ChatRespDto }
) => {
  EloLocalStorage.setObject(EloLocalStorageItemsEnum.chat, action.payload);
  state.chat = action.payload;
};
