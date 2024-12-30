'use client';

import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
// import { AppRouterInstance } from 'next/apps/shared/lib/app-router-context.shared-runtime';

import { getUuid } from 'elo/front/react/Shared';
import {
  AuthApi,
  UserEntity,
  UsersApi,
  WordLangEnum,
} from 'elo/back/server/open-api';

import { getOpenApiConfig } from 'elo/front/react/Shared';
import { singInFirebaseGoogleAdapter } from 'elo/front/react/Adapters';
import {
  SingInProviderEnum,
  SingInResponseType,
} from 'elo/front/react/Adapters';
import {
  MyHttpStatusEnum,
  EloLocalStorage,
  EloLocalStorageItemsEnum,
  EloFrontRoutesEnum,
  MyCoockiesEnum,
  MyCookies,
} from 'elo/front/react/Shared';
import { createUserFirebaseAdapter } from 'elo/front/react/Adapters';
import { AppMsgTypeEnum, addToastMsg, setInProgress } from '../../App';

// TODO: Move this to a common place
export class ApiError<T = unknown, D = any> {
  // constructor(
  //   message?: string,
  //   code?: string,
  //   // config?: InternalAxiosRequestConfig<D>,
  //   request?: any,
  //   response?: string //AxiosResponse<T, D>
  // );

  config?: any; //InternalAxiosRequestConfig<D>;
  code?: string;
  request?: any;
  response?: any; //AxiosResponse<T, D>;
  // isAxiosError: boolean;
  status?: number;
  // toJSON: () => object;
  cause?: Error;
  // static from<T = unknown, D = any>(
  //   error: Error | unknown,
  //   code?: string,
  //   config?: InternalAxiosRequestConfig<D>,
  //   request?: any,
  //   response?: AxiosResponse<T, D>,
  //   customProps?: object
  // ): AxiosError<T, D>;
  static readonly ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS';
  static readonly ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE';
  static readonly ERR_BAD_OPTION = 'ERR_BAD_OPTION';
  static readonly ERR_NETWORK = 'ERR_NETWORK';
  static readonly ERR_DEPRECATED = 'ERR_DEPRECATED';
  static readonly ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
  static readonly ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
  static readonly ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
  static readonly ERR_INVALID_URL = 'ERR_INVALID_URL';
  static readonly ERR_CANCELED = 'ERR_CANCELED';
  static readonly ECONNABORTED = 'ECONNABORTED';
  static readonly ETIMEDOUT = 'ETIMEDOUT';
}

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
const isBrowser = typeof window !== 'undefined';
let authApi: AuthApi;
let usersApi: UsersApi;

const initialAsyncState = () => {
  authApi = new AuthApi(getOpenApiConfig());
  usersApi = new UsersApi(getOpenApiConfig());
  const locaUser = EloLocalStorage.getString(EloLocalStorageItemsEnum.user);
  if (locaUser) {
    const user = JSON.parse(locaUser) as UserEntity;

    return user;
  } else {
    return {} as UserEntity;
  }
};

const userSlice = createAppSlice({
  name: 'user',
  initialState: initialAsyncState,
  reducers: (reducerApi) => ({
    setUser: reducerApi.reducer<UserEntity>((state, action) => {
      console.log('ºº ~ file: userReducer.ts:54 ~ action:', action);

      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.nativeLangId = action.payload.nativeLangId;
      state.targetLangId = action.payload.targetLangId;
      state.sessionToken = action.payload.sessionToken;
      state.successWordsSpeakingGame = action.payload.successWordsSpeakingGame;
      state.successWordsWritingGame = action.payload.successWordsWritingGame;
      state.totalWordsGame = action.payload.totalWordsGame;
      state.currentChatId = action.payload.currentChatId;
      state.avatarUrl = action.payload.avatarUrl;
      state.level = action.payload.level;

      EloLocalStorage.setString(
        EloLocalStorageItemsEnum.user,
        JSON.stringify(action.payload)
      );
    }),

    // Thunks (Async and no pure functions):
    saveUserToLocalstorage: reducerApi.asyncThunk(
      async (user: UserEntity, thunkApi) => {
        await EloLocalStorage.setString(
          EloLocalStorageItemsEnum.user,
          JSON.stringify(user)
        );
        if (user) {
          thunkApi.dispatch(setUser(user));
        } else {
          thunkApi.dispatch(setUser(initialAsyncState()));
        }
      }
    ),

    login: reducerApi.asyncThunk(
      async (
        params: {
          email: string;
          password: string;
          router?: AppRouterInstance;
        },
        thunkApi
      ) => {
        try {
          const resp = await authApi.authControllerLogin(params);
          console.log('ºº ~ file: userReducer.ts:94 ~ resp:', resp);

          if (resp.sessionToken) {
            MyCookies.setItem(MyCoockiesEnum.sessionToken, resp.sessionToken);
            thunkApi.dispatch(saveUserToLocalstorage(resp));
            thunkApi.dispatch(
              addToastMsg({
                text: 'Usuario valido!',
                type: AppMsgTypeEnum.info,
              })
            );
            // params.router.push(EloFrontRoutesEnum.chat);
          } else {
            thunkApi.dispatch(
              addToastMsg({
                text: 'Usuario no valido!',
                type: AppMsgTypeEnum.error,
              })
            );
            thunkApi.dispatch(saveUserToLocalstorage({} as UserEntity));
          }
        } catch (error) {
          thunkApi.dispatch(
            addToastMsg({
              text: 'Error al validar Usuario.',
              type: AppMsgTypeEnum.error,
            })
          );

          console.error(JSON.stringify(error));
        }
      }
    ),

    logout: reducerApi.asyncThunk(
      async (
        params: {
          router: AppRouterInstance;
        },
        thunkApi
      ) => {
        console.log(
          'ºº ~ file: userReducer.ts:117 ~ logout:create.asyncThunk ~ logout2:'
        );
        thunkApi.dispatch(saveUserToLocalstorage({} as UserEntity));
        EloLocalStorage.setString(EloLocalStorageItemsEnum.user, '');
        MyCookies.setItem(MyCoockiesEnum.sessionToken, '');

        thunkApi.dispatch(
          addToastMsg({
            text: 'Usuario finalizado.',
            type: AppMsgTypeEnum.info,
          })
        );

        params.router.push(EloFrontRoutesEnum.login);
      }
    ),

    externalLogin: reducerApi.asyncThunk(
      async (
        params: { providerType: SingInProviderEnum; router: AppRouterInstance },
        thunkApi
      ) => {
        try {
          let singInResp: SingInResponseType;
          if (params.providerType === SingInProviderEnum.google) {
            singInResp = await singInFirebaseGoogleAdapter();
          } else if (params.providerType === SingInProviderEnum.facebook) {
            throw new Error('Provider not implemented yet!');
            // resp = await singInFirebaseFacebookAdapter();
          } else {
            throw new Error('Provider not implemented');
          }

          if (singInResp) {
            const user = await authApi.authControllerExternalLogin({
              email: singInResp.email,
              name: singInResp.name as string,
              avatarUrl: singInResp.avatarUrl as string,
              providerType: singInResp.providerType,
              providerToken: singInResp.providerToken as string,
            });

            if (!user) {
              thunkApi.dispatch(
                addToastMsg({
                  text: 'Error al logearse!',
                  type: AppMsgTypeEnum.error,
                })
              );
              return;
            }

            await thunkApi.dispatch(
              saveUserToLocalstorage({
                ...user,
              })
            );
            MyCookies.setItem(
              MyCoockiesEnum.sessionToken,
              user?.sessionToken ?? ''
            );
            thunkApi.dispatch(
              addToastMsg({
                text: 'Usuario valido.',
                type: AppMsgTypeEnum.info,
              })
            );

            params.router.push(EloFrontRoutesEnum.chat);
          }
        } catch (error) {
          thunkApi.dispatch(
            addToastMsg({
              text: 'Error al logearse!',
              type: AppMsgTypeEnum.error,
            })
          );

          console.error('ExternalLogin error:', error);
        }
      }
    ),

    createUser: reducerApi.asyncThunk(
      async (
        params: {
          name: string;
          email: string;
          password: string;
          nativeLangId: WordLangEnum;
          targetLangId: WordLangEnum;
        },
        thunkApi
      ) => {
        thunkApi.dispatch(setInProgress(true));
        try {
          const userId = getUuid();
          console.log('ºº ~ file: userReducer.ts:241 ~ usersApi:', usersApi);
          const resp = await usersApi.usersControllerInsert({
            ...params,
            userId,
            level: 0,
            successWordsSpeakingGame: 0,
            successWordsWritingGame: 0,
            totalWordsGame: 0,
          });

          if (resp !== undefined) {
            const resp = await createUserFirebaseAdapter(params);
            console.log('ºº ~ file: userReducer.ts:150 ~ resp:', resp);

            thunkApi.dispatch(
              login({ ...params }) // TODO: Fix this
            );
          }
        } catch (error: unknown) {
          thunkApi.dispatch(setInProgress(false));
          if (
            error instanceof Response &&
            error.status === MyHttpStatusEnum.CONFLICT
          ) {
            console.log('ºº ~ file: userReducer.ts:169 ~ CONFLICT:');

            thunkApi.dispatch(
              addToastMsg({
                text: 'Ya existe otro usuario con este email.',
                type: AppMsgTypeEnum.error,
              })
            );
          } else {
            thunkApi.dispatch(
              addToastMsg({
                text: 'Error desconocido, intentalo de nuevo.',
                type: AppMsgTypeEnum.error,
              })
            );
          }
        }
        thunkApi.dispatch(setInProgress(false));
      }
    ),

    updateUser: reducerApi.asyncThunk(
      async (
        params: {
          userId: string;
          pushSubscriptionRaw: string;
        },
        thunkApi
      ) => {
        thunkApi.dispatch(setInProgress(true));
        try {
          const resp = await usersApi.usersControllerUpdate({
            ...params,
          });
        } catch (error: unknown) {
          thunkApi.dispatch(
            addToastMsg({
              text: 'Error desconocido, no se puedo subcribir al push.',
              type: AppMsgTypeEnum.error,
            })
          );
        }

        thunkApi.dispatch(setInProgress(false));
      }
    ),
  }),
});

export const {
  setUser,
  saveUserToLocalstorage,
  login,
  createUser,
  externalLogin,
  logout,
  updateUser,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
