'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

import { ChatMicSvg, sendChatMsg } from '../index';

// regenerator-runtime/runtime its required for react-speech-recognition
// import 'regenerator-runtime/runtime';
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from 'react-speech-recognition';

// declare global {
//   interface Window {
//     SpeechRecognition: SpeechRecognitionI;
//     webkitSpeechRecognition: SpeechRecognitionI;
//   }
// }

// TODO: move styles to css
export const ChatInput = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  // TODO change to react-speech-recognition
  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();

  // State
  const inProgress = useSelector((state: any) => state.app.inProgress);
  const [text, setText] = useState('');

  useEffect(
    () => {
      const speechRecognition = getSpeechRecognition();

      // return () => {
      //   if (speechRecognition) {
      //     speechRecognition.stop();
      //   }
      //   (window as any).recognition = null;
      // };
    },
    [
      /*onAdd*/
    ]
  );

  return (
    <>
      <div
        style={{
          height: 50,
          marginLeft: 20,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          boxShadow: '2px 2px 5px 0px #284035',
          borderRadius: 15,
        }}
      >
        <input
          style={{
            fontSize: 20,
            width: '100%',
            margin: 5,
            padding: 5,
            borderRadius: 10,
          }}
          value={text}
          onKeyDown={(key) => {
            if (!inProgress && key.code === 'Enter') {
              console.log(
                'ºº ~ file: ChatInput.tsx:58 ~ ChatInput ~ 2inProgress:',
                text
              );

              dispatch(sendChatMsg({ text }));
              setText('');
            }
          }}
          onChange={(v) => {
            setText(v.target.value);
          }}
        />
      </div>
      <ChatMicSvg
        onMouseDown={onChatMicSvgMouseDown}
        onMouseUp={onChatMicSvgMouseUp}
      />
    </>
  );

  function onChatMicSvgMouseDown() {
    if (typeof window !== 'undefined' && (window as any).recognition) {
      (window as any).recognition.start();
    }
  }

  function onChatMicSvgMouseUp() {
    if (typeof window !== 'undefined' && (window as any).recognition) {
      (window as any).recognition.stop();
    }
  }

  function getSpeechRecognition() {
    // let speechRecognition: SpeechRecognition;

    try {
      // const SpeechRecognition =
      //   window.SpeechRecognition ||
      //   ((window as any).webkitSpeechRecognition as {
      //     new (): SpeechRecognition;
      //   });
      // speechRecognition = new SpeechRecognition();

      // speechRecognition.onerror = (event: any) => {
      //   if (event.error === 'no-speech') {
      //     console.log('No speech was detected. Try again.');
      //   }
      // };

      const targetLangId = localStorage.getItem('targetLangId');
      // speechRecognition.lang = targetLangId
      //   ? `${targetLangId}-${targetLangId.toUpperCase()}`
      //   : 'en-US';

      // speechRecognition.onstart = () => {
      //   console.log(
      //     'Voice recognition activated. Try speaking into the microphone.'
      //   );
      // };

      // speechRecognition.onspeechend = () => {
      //   console.log(
      //     'You were quiet for a while so voice recognition turned itself off.'
      //   );
      // };

      // speechRecognition.onresult = (event: any) => {
      //   const current = event.resultIndex;
      //   const transcript = event.results[current][0].transcript;
      //   console.log('Voice rec result: ', event.results);
      //   console.log('speech', {
      //     text: transcript,
      //     res: event.results,
      //   });
      //   dispatch(sendChatMsg({ text: transcript as string }));
      //   setText('');
      // };

      // Save recognition to window to access it in event handlers
      // (window as any).recognition = speechRecognition;
    } catch (e) {
      console.error(e);
    }

    // return speechRecognition;
  }
};
