'use client';

export enum EloLocalStorageItemsEnum {
  user = 'user',
  chats = 'chats',
  chat = 'chat',
}

export class EloLocalStorage {
  static setString(key: EloLocalStorageItemsEnum, value: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }

  static getString(key: EloLocalStorageItemsEnum) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return (window && window.localStorage.getItem(key)) ?? '';
    } else {
      return '';
    }
  }

  static setObject(key: EloLocalStorageItemsEnum, object: object) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(object));
    }
  }

  static getObject(key: EloLocalStorageItemsEnum) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = (window && window.localStorage.getItem(key)) ?? null;
      return item ? JSON.parse(item) : null;
    } else {
      return {};
    }
  }
}
