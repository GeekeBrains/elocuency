export enum MyCoockiesEnum {
  sessionToken = 'sessionToken',
}

export class MyCookies {
  static setItem(key: MyCoockiesEnum, value: string) {
    document.cookie = `${key}=${value}`;
    // console.log(
    //   'ºº ~ file: MyCookies.ts:9 ~ MyCookies ~ setItem ~ document.cookie:',
    //   document.cookie
    // );
  }

  static getItem(key: MyCoockiesEnum) {
    const cookies = document.cookie.split(';');

    const cookie = cookies.find((cookie) => cookie.includes(key));
    console.log(
      'ºº ~ file: MyCookies.ts:14 ~ MyCookies ~ getItem ~ document.cookie:',
      cookie
    );
    return cookie ? cookie.split('=')[1] : '';
  }
}
