'use client';
import { ThunkDispatch } from '@reduxjs/toolkit';
import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { addChatByUsers, addUserToChat, loadChats, setChat } from '../Redux';

import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
} from 'elo/front/react/Shared';
import { ChatRespDto, UserEntity } from 'elo/back/server/open-api';
import { setUser } from '../../User';

const Button = (props: { onClick: () => void; label: string }) => {
  return (
    <div
      style={{
        ...styles.userCircle,
        height: '35px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        marginRight: '-10px',
        marginLeft: '10px',
      }}
      onClick={props.onClick}
    >
      {props.label}
    </div>
  );
};

const ChatSelector: React.FC<> = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const chats: ChatRespDto[] = useSelector(
    (state: { chat: { chats: ChatRespDto[] } }) => state.chat.chats
  );
  const user = useSelector((state: { user: UserEntity }) => state.user);

  const [userKey, setUserKey] = useState<string>('');
  const [chatName, setChatName] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentChat, setCurrentChat] = useState<ChatRespDto>(
    {} as ChatRespDto
  );

  useEffect(() => {
    const user: UserEntity = EloLocalStorage.getObject(
      EloLocalStorageItemsEnum.user
    ) as UserEntity;
    if (chats.length === 0) {
      dispatch(loadChats());
    } else {
      const currentChat = chats.find(
        (chat: ChatRespDto) => chat?.chatId === user.currentChatId
      );
      if (currentChat) setCurrentChat(currentChat);
    }
  }, []);

  console.log('<< Chats: ', chats);

  return (
    <div style={styles.container}>
      <div style={styles.selectedUser} onClick={onClickOpenListHandler}>
        <div
          style={{
            ...styles.userCircle,
            ...styles.selectedUserCircle,
          }}
        >
          {getChatInitials(currentChat.name)}
        </div>
        <IoMdArrowDropdown size={15} style={styles.selectedUserArrow} />
      </div>
      {isOpen && (
        <>
          <div style={styles.userList as React.CSSProperties}>
            {chats.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => onClickSetCurrentChatHandler(chat)}
                style={{
                  ...styles.userCircle,
                }}
              >
                {getChatInitials(chat?.name)}
              </div>
            ))}
          </div>
          <div
            key={'onClickAddUserToChatHandler'}
            style={{
              ...styles.userCircle,
              gap: '8px',
              zIndex: 10,
            }}
          >
            <input
              style={styles.input}
              type="text"
              placeholder="UserId/email/Phone"
              onChange={(e) => setUserKey(e.target.value)}
              value={userKey}
            />

            <Button
              onClick={onClickAddUserToChatHandler}
              label="Añadir Usuario"
            />
          </div>
          <div
            key={'onClickAddChatByUsersHandler'}
            style={{
              ...styles.userCircle,
              gap: '8px',
              zIndex: 10,
            }}
          >
            <input
              style={styles.input}
              type="text"
              placeholder="Nombre Chat"
              onChange={(e) => setChatName(e.target.value)}
              value={chatName}
            />
            <input
              style={styles.input}
              type="text"
              placeholder="UserId/email/Phone"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
            />

            <Button onClick={onClickAddChatByUsersHandler} label="Nuevo Chat" />
          </div>
          <div
            key={'onClickLoadChatsHandler'}
            style={{
              ...styles.userCircle,
              gap: '8px',
              zIndex: 10,
            }}
          >
            <Button onClick={onClickLoadChatsHandler} label="Cargar Chats" />
          </div>
        </>
      )}
    </div>
  );

  function onClickOpenListHandler() {
    console.log('ºº ~ file: UserSelector.tsx:75 ~ value:', isOpen);
    setIsOpen((value) => {
      return !value;
    });
  }

  function onClickAddUserToChatHandler() {
    dispatch(addUserToChat({ userId: userKey, chatId: currentChat.chatId }));
  }

  function onClickAddChatByUsersHandler() {
    console.log(
      'ºº ~ file: ChatSelector.tsx:165 ~ onClickAddChatByUsersHandler ~ userKey:',
      { userKey, chatName }
    );
    dispatch(addChatByUsers({ userKey, chatName }));
  }

  function onClickLoadChatsHandler() {
    dispatch(loadChats());
  }

  // Maneja el cambio de usuario activo
  function onClickSetCurrentChatHandler(selectedChat: ChatRespDto) {
    console.log(
      'ºº ~ file: ChatSelector.tsx:60 ~ handleChatIdClick ~ chat:',
      selectedChat,
      user
    );
    // TODO: Cambiar el chat activo user.currentChatId
    setCurrentChat(selectedChat);
    dispatch(setChat(selectedChat));
    dispatch(setUser({ ...user, currentChatId: selectedChat.chatId }));
  }

  function getChatInitials(name: string) {
    return name?.length > 15 ? name.slice(-15).toUpperCase() + '...' : name;
  }
};

// Estilos en línea
const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
    // flexDirection: 'row-reverse',
    marginTop: '10px',
    flexFlow: 'column',
  },
  userList: {
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    margin: '10px',
  },
  userCircle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '45px',
    borderRadius: '45px',
    cursor: 'pointer',
    fontSize: 'small',
    fontWeight: 'bold',
    color: 'rgb(255 255 255)',
    backgroundColor: '#ffffffa6',
    padding: '16px 16px 16px 16px',
    zIndex: 10,
  },
  selectedUser: {
    marginLeft: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    left: '10px',
    zIndex: 10,
  },
  selectedUserCircle: {
    padding: '16px 23px 16px 16px',
  },
  selectedUserArrow: {
    position: 'relative',
    top: '-1px',
    left: '-21px',
    color: 'white',
  },
  input: {
    marginLeft: '-10px',
    border: '15px',
    outline: 'none',
    borderRadius: '35px',
    height: '35px',
    padding: '10px',
  },
};

export default ChatSelector;
