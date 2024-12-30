import { ChatsApi } from 'elo/back/server/open-api';
import { setInProgress } from '../../App';
import { getOpenApiConfig } from 'elo/front/react/Shared';

export const addUserToChatFactory = async (
  params: { userId: string; chatId: string },
  thunkApi: any
) => {
  console.log(
    'ºº ~ file: addUserToChatFactory.ts:11 ~ addUserToChatFactory:'.params
  );
  thunkApi.dispatch(setInProgress(true));
  const chatsApi = new ChatsApi(getOpenApiConfig());

  await chatsApi.chatsControllerAddUser(params);
};
