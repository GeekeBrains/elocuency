import { ReducerCreators } from '@reduxjs/toolkit';
import { addChatToBoard, ChatSlideType } from '.';
import { ChatRespDto, ChatsApi, UserEntity } from 'elo/back/server/open-api';
import { setInProgress } from '../../App';
import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
} from 'elo/front/react/Shared';

export const loadChatsFactory = (
  reducerApi: ReducerCreators<ChatSlideType>,
  chatsApi: ChatsApi,
  user: UserEntity
) => {
  return reducerApi.asyncThunk(async (_, thunkApi) => {
    thunkApi.dispatch(setInProgress(true));
    const userId = user.userId.toString();
    console.log(
      'ºº ~ file: loadChatsFactory.ts:31 ~ returnreducerApi.asyncThunk ~ userId:',
      userId
    );

    await thunkApi.dispatch(addChatToBoard(null));

    const chats: ChatRespDto[] = await chatsApi.chatsControllerGetChatsByUser(
      userId
    );
    console.log(
      'ºº ~ file: loadChatsFactory.ts:23 ~ returnreducerApi.asyncThunk ~ chats:',
      chats
    );

    // TODO: There are a problem on chatsControllerGetChatsByUser that return a chat null at the end.
    const filteredChats = [];
    for (const chat of chats) {
      if (chat) {
        console.log(
          'ºº ~ file: loadChatsFactory.ts:29 ~ returnreducerApi.asyncThunk ~ chat:',
          chat
        );
        filteredChats.push(chat);
        await thunkApi.dispatch(addChatToBoard(chat));
      }
    }
    EloLocalStorage.setObject(EloLocalStorageItemsEnum.chats, filteredChats);

    thunkApi.dispatch(setInProgress(false));
  });
};
