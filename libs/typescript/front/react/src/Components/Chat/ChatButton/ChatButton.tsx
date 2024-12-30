'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { ChatMsgEntity } from 'elo/back/server/open-api';
import { sendChatMsg } from '../Redux/chatSlide';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { WordLangEnum } from '../../User';
import { IoIosMore } from 'react-icons/io';

// TODO: Rehubicar
export interface Command {
  service: string;
  method: string;
  params: string;
}

export const ChatButton = (props: {
  msg: ChatMsgEntity & { command?: Command; callback: Command };
}) => {
  const [showTools, setShowTools] = useState(false);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  return (
    <motion.div
      style={{ position: 'relative' }}
      className="chatButton"
      initial={{ rotate: 180, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 560,
        damping: 20,
        duration: 1,
      }}
      onClick={onClickMsg}
    >
      {props.msg.body}
      {showTools ? (
        <div style={{ fontSize: 'smaller' }}>
          command: {JSON.stringify(props.msg.command)} <br />
          callback: {JSON.stringify(props.msg.callback)} <br />
          langId: {props.msg.langId}
          <HiOutlineSpeakerWave
            onClick={() => {
              const ssu = new global.SpeechSynthesisUtterance(props.msg.body);
              if (ssu) {
                if (props.msg.langId === WordLangEnum.es) {
                  ssu.lang = 'es-ES';
                } else if (props.msg.langId === WordLangEnum.en) {
                  ssu.lang = 'en-GB';
                }
                global.speechSynthesis.speak(ssu);
              }
            }}
          />
        </div>
      ) : (
        <></>
      )}

      <IoIosMore
        style={{ position: 'absolute', top: '2px', right: '11px' }}
        onClick={() => {
          setShowTools((value) => !value);
        }}
      />
    </motion.div>
  );

  function onClickMsg() {
    dispatch(
      sendChatMsg({
        text: `!${props.msg.callback?.service}.${
          props.msg.callback?.method
        }(${JSON.stringify(props.msg.callback?.params)})`,
      })
    );
  }
};
