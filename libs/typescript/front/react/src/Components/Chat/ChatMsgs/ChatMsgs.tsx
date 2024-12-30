'use client';

import { useEffect, useRef } from 'react';

import { ChatMsg } from '../ChatMsg/ChatMsg';
import { ChatMsgPrize } from '../ChatMsgPrize/ChatMsgPrize';
import { ChatMarkdown } from '../ChatMarkdown/ChatMarkdown';
import { ChatButton } from '../ChatButton/ChatButton';
import { ChatProgress } from '../ChatProgress/ChatProgress';
import { useSelector } from 'react-redux';
import { ChatMsgEntity, ChatRespDto } from 'elo/back/server/open-api';

export const ChatMsgs = () => {
  const msgs = useSelector((state: any) => state.chat.msgs) as ChatMsgEntity[];

  const chatMsgsRef = useRef();

  useEffect(() => {
    const chatDiv = document.getElementById('chatView');
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv?.scrollHeight;
    }
  }, [msgs]);

  useEffect(() => {
    type ChatViewType =
      | {
          scrollTop: number;
          scrollHeight: number;
          clientHeight: number;
        }
      | undefined;
    // console.log('ref:', chatMsgsRef);
    // const chatView: ChatViewType = chatMsgsRef.current; //?.scrollIntoView({ behavior: "smooth" });
    const chatView = global.document.getElementById('chatView');
    if (chatView) {
      chatView.scrollTop = chatView.scrollHeight - chatView.clientHeight;
    }
    // console.log("scroll", chatView);
  }, [msgs]);

  // console.log('ChatMsgs', msgs);
  return (
    <div
      // ref={chatMsgsRef}
      id="chatView"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        overflowY: 'auto',
        // overflow: 'hidden',
      }}
      // disabled={false}
    >
      <div style={{ height: '60px' }}></div>
      {msgs.map((msg: ChatMsgEntity, index: number) => {
        let msgComp = null;
        if (!msg.type || msg.type === 'text') {
          if (msg.body === 'botPrize') {
            msgComp = <ChatMsgPrize key={'keyMsg' + index} msg={msg} />;
          } else {
            msgComp = (
              <ChatMsg
                key={'keyMsg' + index}
                msg={msg}
                // voiceSpanish={voiceSpanish}
                // voiceEnglish={voiceEnglish}
              />
            );
          }
        } else if (msg.type === 'markdown') {
          msgComp = <ChatMarkdown key={'keyMsg' + index} text={msg.body} />;
        } else if (msg.type === 'button') {
          msgComp = <ChatButton key={'keyMsg' + index} msg={msg} />;
        } else if (msg.type === 'progress') {
          msgComp = <ChatProgress key={'keyMsg' + index} msg={msg} />;
        } else {
          console.error('type no definido', msg);
        }
        return msgComp;
      })}
    </div>
  );
};
