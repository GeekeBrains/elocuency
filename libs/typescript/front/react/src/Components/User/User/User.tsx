'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { UserEntity } from 'elo/back/server/open-api';
import { createUser, AppReduxType } from 'elo/front/react/Components';
import { IsValid } from 'elo/front/react/Shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { EloFrontRoutesEnum } from 'elo/front/react/Shared';

export enum WordLangEnum {
  es = 'es',
  en = 'en',
  fr = 'fr',
  it = 'it',
  pt = 'pt',
}

enum EditModeEnum {
  edit = 'edit',
  create = 'create',
}

export const UserForm = () => {
  const router = useRouter();
  const user = useSelector((state: { user: UserEntity }) => state.user);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  // State
  const app = useSelector((state: { app: AppReduxType }) => state.app);
  const [editMode, setEditMode] = useState(EditModeEnum.edit);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLangId, setLangIdNative] = useState('es');
  const [targetLangId, setLangIdTarget] = useState('en');

  // Effects
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setLangIdNative(user.nativeLangId);
    setLangIdTarget(user.targetLangId);

    setEditMode(user.sessionToken ? EditModeEnum.edit : EditModeEnum.create);
  }, []);

  useEffect(() => {
    if (editMode === EditModeEnum.create && user.sessionToken) {
      router.push(EloFrontRoutesEnum.chat);
    }
  }, [user.sessionToken, router, editMode]);

  return (
    <form onSubmit={onSubmitForm}>
      {editMode === EditModeEnum.create ? (
        <h1>Nuevo usuario</h1>
      ) : (
        <h1>Usuario</h1>
      )}
      <div className="form-field">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          required
        ></input>
      </div>
      <div className="form-field">
        <label htmlFor="name">Lengua nativa</label>
        <input
          id="nativeLangId"
          name="nativeLangId"
          type="text"
          value={nativeLangId}
          onChange={(event) => {
            setLangIdNative(event.target.value);
          }}
          required
        ></input>
      </div>
      <div className="form-field">
        <label htmlFor="name">Lengua objetivo</label>
        <input
          id="targetLangId"
          name="targetLangId"
          type="text"
          value={targetLangId}
          onChange={(event) => {
            setLangIdTarget(event.target.value);
          }}
          required
        ></input>
      </div>
      <div className="form-field">
        <label htmlFor="email">eMail</label>
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
      {editMode === EditModeEnum.create && (
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
            placeholder="Mínimo 8 caracteres"
          ></input>
        </div>
      )}
      <div className="form-buttons">
        {editMode === EditModeEnum.create && (
          <>
            <Link href={EloFrontRoutesEnum.login}>Login</Link>
            {app.inProgress ? 'in progress' : ''}
            <button disabled={app.inProgress} type="submit">
              Aceptar
            </button>
          </>
        )}
      </div>
    </form>
  );

  // Events
  async function onSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    console.log('ºº ~ file: CreateUser.tsx:124 ~ onSubmitForm ~ event:', event);

    event.preventDefault();

    if (validateFields()) {
      dispatch(
        createUser({
          name,
          email,
          nativeLangId: WordLangEnum.es,
          targetLangId: WordLangEnum.en,
          password,
        })
      );
    } else {
      console.error('No valid form');
    }
  }

  // Functions
  function validateFields(): boolean {
    if (!name) {
      return false;
    }
    if (!email || !IsValid.email(email)) {
      return false;
    }
    if (!password || !IsValid.password(password)) {
      setPassword('');
      return false;
    }

    return true;
  }
};
