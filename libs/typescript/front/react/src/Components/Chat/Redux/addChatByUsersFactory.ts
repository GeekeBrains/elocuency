import { ReducerCreators } from '@reduxjs/toolkit';
import { addChatToBoard, ChatSlideType } from '.';
import { ChatsApi, UserEntity } from 'elo/back/server/open-api';
import { setInProgress } from '../../App';
import { getOpenApiConfig } from 'elo/front/react/Shared';

export const addChatByUsersFactory = (
  reducerApi: ReducerCreators<ChatSlideType>,
  chatsApi: ChatsApi,
  user: UserEntity
) => {
  return reducerApi.asyncThunk(
    async (params: { userKey: string; chatName: string }, thunkApi) => {
      console.log('ºº ~ file: addChatByUsersFactory.ts:13 ~ params:', params);
      thunkApi.dispatch(setInProgress(true));
      const chatsApi = new ChatsApi(getOpenApiConfig());

      const chat = await chatsApi.chatsControllerAddByUsers({
        userIdAdmin: user.userId.toString(),
        userKey: params.userKey,
        chatName: params.chatName,
      });

      console.log('ºº ~ file: addChatByUsersFactory.ts:27 ~ resp:', chat);
      thunkApi.dispatch(addChatToBoard(chat));

      thunkApi.dispatch(setInProgress(false));
    }
  );
};
