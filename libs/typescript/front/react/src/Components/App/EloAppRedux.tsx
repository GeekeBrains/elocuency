'use client';

import { useEffect } from 'react';
import { ChatBoard } from '../Chat';
import { addChatMsgToBoard } from '../Chat/Redux/chatSlide';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
  ServiceWorkerHelper,
} from 'elo/front/react/Shared';
import { updateUser } from '../User';
import { ChatMsgEntity, UserEntity } from 'elo/back/server/open-api';
import { Header } from './Header/Header';

let registerServiceWorkerCalled = false;
export function EloAppRedux() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    if (!registerServiceWorkerCalled) {
      // To void multiple calls useEffect on dev
      registerServiceWorkerCalled = true;

      // Register the service worker, push notifications and check all
      ServiceWorkerHelper.checkAll(
        (params: { pushSubscriptionRaw: string }) => {
          const user: UserEntity = EloLocalStorage.getObject(
            EloLocalStorageItemsEnum.user
          );
          dispatch(
            updateUser({
              pushSubscriptionRaw: params.pushSubscriptionRaw,
              userId: user.userId,
            })
          );
        }
      );

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const data = event.data;
        console.log('Mensaje recibido desde el Service Worker:', data);
        dispatch(addChatMsgToBoard(data as ChatMsgEntity));
      });
    }
  }, []);

  return (
    <>
      <Header />
      <ChatBoard />;
    </>
  );
}
