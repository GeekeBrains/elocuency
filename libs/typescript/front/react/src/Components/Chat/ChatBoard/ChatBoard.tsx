'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PacmanLoader } from 'react-spinners';

import { ChatMsgs, ChatInput, loadChatMsgs, loadSpeechVoices } from '../index';

import styles from './Chat.module.css';
import './chat.css';
import { ThunkDispatch } from '@reduxjs/toolkit';

type MsgType = {
  userId: string;
  emotion?: string;
  prize?: number;
  voice?: {
    mute: boolean;
    rate: number;
  };
  type?: string;
};
type UserType = {
  id: string;
  email: string;
  chatId: string;
};

// UseEffect load twice on dev mode
let haveUseEffect = false;

export function ChatBoard() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  // State
  const inProgress = useSelector((state: any) => state.app.inProgress);
  const user = useSelector((state: any) => state.user);

  // Effects
  useEffect(() => {
    if (haveUseEffect) return;
    haveUseEffect = true;

    if (user?.sessionToken) {
      dispatch(loadSpeechVoices());
      dispatch(loadChatMsgs());
    }
  }, []);

  return (
    <div className={styles.ChatBoard}>
      {inProgress ? (
        <PacmanLoader
          color={'#ffffff'}
          loading={inProgress}
          cssOverride={{
            position: 'absolute',
            top: '50%',
            left: 'calc(50% - 75px)',
          }}
          size={50}
        />
      ) : (
        <></>
      )}
      <ChatMsgs />
      {/* <Score
        activeTimer={activeTimer}
        speed={speed}
        wordNumberOk={wordNumberOk}
        wordNumberTarget={wordNumberTarget}
        endTimeEvent={() => {
          processesUserResponse('x?');
        }}
        ref={scoreRef}
      /> */}
      <footer
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          position: 'absolute',
          bottom: 10,
          left: 0,
          height: 50,
          justifyContent: 'center',
        }}
      >
        <ChatInput />
      </footer>
    </div>
  );
}
