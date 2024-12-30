import { addChatMsgToBoard } from '.';
import { ChatEntity, ChatMsgEntity, ServerApi } from 'elo/back/server/open-api';
import { setInProgress } from '../../App';
import { getUtcIso } from 'elo/front/react/Shared';
import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
  getOpenApiConfig,
} from 'elo/front/react/Shared';
import { RootState } from 'elo/front/react/Redux';

export const sendChatMsgsFactory = async (
  params: { text: string },
  thunkApi: any
) => {
  const state = thunkApi.getState() as RootState;
  const { msgs } = state.chat;
  const receiveMsg = msgs[msgs.length - 1];
  console.log('Messages:', receiveMsg);

  console.log('ºº ~ file: chatReducer.ts:62 ~ text:', params);
  thunkApi.dispatch(setInProgress(true));

  const serverApi = new ServerApi(getOpenApiConfig());

  const user = EloLocalStorage.getObject(EloLocalStorageItemsEnum.user);
  const chats = EloLocalStorage.getObject(EloLocalStorageItemsEnum.chats);
  const currentChat = chats.find(
    (chat: ChatEntity) => chat?.chatId.toString() === user.currentChatId
  );

  const msg: ChatMsgEntity = {
    userId: user.userId,
    chatToken: currentChat?.chatToken,
    chatId: currentChat.chatId,
    langId: user.nativeLangId,
    type: 'text',
    body: params.text,
    utc: getUtcIso(),
    command: receiveMsg?.callback,
  };

  try {
    await serverApi.appControllerAddMsg(msg);
    thunkApi.dispatch(addChatMsgToBoard(msg));
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    thunkApi.dispatch(setInProgress(false));
  }
};
