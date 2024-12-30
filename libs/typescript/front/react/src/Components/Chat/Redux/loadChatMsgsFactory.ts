import { ChatsApi, UserEntity } from 'elo/back/server/open-api';
import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
  getOpenApiConfig,
} from 'elo/front/react/Shared';

import { setInProgress } from '../../App';
import { addChatMsgToBoard } from '.';

const NUM_FIRST_MSG_LOADED = 10;

export const loadChatMsgsFactory = async (_: unknown, thunkApi: any) => {
  thunkApi.dispatch(setInProgress(true));

  const chatsApi = new ChatsApi(getOpenApiConfig());
  const user = EloLocalStorage.getObject(
    EloLocalStorageItemsEnum.user
  ) as UserEntity;
  const resp = await chatsApi.chatsMsgsControllerGetMsgsByIdLast(
    user.currentChatId as string,
    NUM_FIRST_MSG_LOADED
  );

  if (Array.isArray(resp)) {
    for (const msg of resp) {
      thunkApi.dispatch(addChatMsgToBoard(msg));
    }
  }
  thunkApi.dispatch(setInProgress(false));
};
