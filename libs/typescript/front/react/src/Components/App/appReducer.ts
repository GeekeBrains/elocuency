'use client';

import { createSlice } from '@reduxjs/toolkit';
import { Bounce, toast } from 'react-toastify';

export enum AppMsgTypeEnum {
  info = 'info',
  error = 'error',
}
export type AppMsgType = {
  text: string;
  type: AppMsgTypeEnum;
};

export type AppReduxType = {
  inProgress: boolean;
};

const initialState: AppReduxType = {
  inProgress: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: (create) => ({
    addToastMsg: create.reducer<AppMsgType>((state, action) => {
      // const { Bounce } = require('react-toastify');
      if (action.payload.type === AppMsgTypeEnum.error) {
        toast.error(action.payload.text, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      } else {
        toast.info(action.payload.text, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      }

      // state.msgs.push(action.payload);
    }),

    setInProgress: create.reducer<boolean>((state, action) => {
      state.inProgress = action.payload;
    }),
  }),
});

export const { addToastMsg, setInProgress } = appSlice.actions;
export const appReducer = appSlice.reducer;
