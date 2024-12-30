'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// import { toast, Bounce } from 'react-toastify';

import { UserEntity } from 'elo/back/server/open-api';

import { externalLogin, login } from 'elo/front/react/Components';
import ElocuencyLogo from 'elo/media/Images/elocuency-logo.png';

import {
  EloLocalStorage,
  EloLocalStorageItemsEnum,
  EloFrontRoutesEnum,
} from 'elo/front/react/Shared';
import { SingInProviderEnum } from 'elo/front/react/Adapters';

import styles from './Login.module.css';

export const LoginForm = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();

  // State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Effects
  useEffect(() => {
    const userStorage = EloLocalStorage.getString(
      EloLocalStorageItemsEnum.user
    );
    if (userStorage) {
      const localUser = JSON.parse(userStorage) as UserEntity;
      if (localUser) setEmail(localUser.email);
    }
  }, []);

  // Render
  return (
    <form id={styles.login} onSubmit={onSubmitForm}>
      <h1>elocuency</h1>
      <Image
        src={ElocuencyLogo}
        alt="Elocuency"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          margin: 'auto',
          display: 'block',
        }}
      />
      <div className="form-field">
        <label htmlFor="email">Login</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
        ></input>
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          required
        ></input>
      </div>
      <div className="form-buttons">
        <Link href={EloFrontRoutesEnum.signUp}>Usuario nuevo</Link>
        <button className={styles.LoginButton} type="submit">
          Aceptar
        </button>
      </div>
      <div className={styles.OtherLogins}>
        <div className={styles.OtherLogin}>
          <Image
            src={'/logos/google.svg'}
            alt="Google Logo"
            width={20}
            height={20}
          ></Image>
          <span onClick={googleOnClick}>Login con Google</span>
        </div>
        {/* <div className={styles.OtherLogin}>
            <Image
              src={'/logos/facebook.svg'}
              alt="Facebook Logo"
              width={20}
              height={20}
            ></Image>
            <span onClick={(event) => onFacebookHandler()}>
              Login con Facebook
            </span>
          </div> */}
      </div>
    </form>
  );

  // Events
  async function onSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(login({ email, password, router }));
  }

  async function googleOnClick() {
    dispatch(
      externalLogin({ providerType: SingInProviderEnum.google, router })
    );
  }
};
