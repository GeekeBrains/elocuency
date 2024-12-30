'use client';

import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import {
  chatReducer,
  onChangeUserForChats,
  setUser,
  userReducer,
  appReducer,
} from 'elo/front/react/Components';

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  // matcher: isAnyOf(action1, action2, action3),
  actionCreator: setUser as any,
  effect: onChangeUserForChats as any,
});

export const rootStore = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Derive RootState from your store type
export type RootState = ReturnType<typeof rootStore.getState>;
