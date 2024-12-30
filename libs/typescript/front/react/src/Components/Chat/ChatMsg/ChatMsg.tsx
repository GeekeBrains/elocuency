'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ChatMsgEntity,
  ChatRespDto,
  UserEntity,
  WordLangEnum,
} from 'elo/back/server/open-api';
import { ChatMsgContainer, ChatMsgUserContainer } from './ChatMsg.styles';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { IoIosMore } from 'react-icons/io';
import { Command } from '../ChatButton';

export enum MsgTypeEnum {
  user = 'user',
  other = 'other',
}

export const ChatMsg = (props: {
  msg: ChatMsgEntity & { command?: Command; callback: Command };
}) => {
  const user = useSelector(
    (state: { user: UserEntity & { userType: string } }) => state.user
  ) as UserEntity & { userType: string };
  const chat = useSelector((state: any) => state.chat.chat) as ChatRespDto;

  const [showTools, setShowTools] = useState(false);
  let outputText = props.msg.body;
  // console.log('ºº ~ file: ChatMsg.tsx:24 ~ ChatMsg ~ props.msg:', props.msg);
  if (props.msg.hidden) {
    outputText = '📣';
  }

  const userType =
    props.msg.userId === user.userId ? MsgTypeEnum.user : MsgTypeEnum.other;

  const msgUser = chat.users.find((user) => user.userId === props.msg.userId);
  return (
    <ChatMsgContainer
      className={'chatMsg chatMsg-' + userType}
      userType={userType}
      hidden={props.msg.hidden ?? false}
      style={{ position: 'relative' }}
    >
      <ChatMsgUserContainer>{msgUser?.name}</ChatMsgUserContainer>
      {/* {userType === MsgTypeEnum.user ? '👤' : '🤖'} */}
      {outputText}
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
        style={{ position: 'absolute', top: '2px', right: '5px' }}
        onClick={() => {
          setShowTools((value) => !value);
        }}
      />
    </ChatMsgContainer>
  );
};
