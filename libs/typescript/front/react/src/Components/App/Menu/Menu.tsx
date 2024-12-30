'use client';

import { useEffect, useState } from 'react';
import { IoMenu as MenuIcon } from 'react-icons/io5';
import { IoMdClose as CloseIcon } from 'react-icons/io';

import styles from './Menu.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from 'elo/front/react/Components';
import { useRouter } from 'next/navigation';
import { UserEntity } from 'elo/back/server/open-api';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { EloFrontRoutesEnum } from 'elo/front/react/Shared';

export const Menu = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();

  // State
  const user = useSelector((state: { user: UserEntity }) => {
    return state.user;
  }) as UserEntity;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Render
  return (
    <div className={styles.Menu}>
      <div className={styles.Icon} onClick={onClickMenuIcon}>
        {isOpen ? <CloseIcon size={40} /> : <MenuIcon size={40} />}
      </div>
      {isOpen && (
        <ul className={styles.MenuList}>
          <li>
            <a onClick={onClickUser}>Mis datos</a>
          </li>
          <li>
            <a onClick={onClickChat}>Chat</a>
          </li>
          <li>
            <a onClick={onClickLogout}>Salir</a>
          </li>
        </ul>
      )}
    </div>
  );

  // Events
  function onClickMenuIcon() {
    setIsOpen((value) => !value);
  }

  function onClickLogout() {
    dispatch(logout({ router }));
  }

  function onClickChat() {
    router.push(EloFrontRoutesEnum.chat);
    setIsOpen(false);
  }

  function onClickUser() {
    router.push(EloFrontRoutesEnum.user);
    setIsOpen(false);
  }
};
