import { EloConsole } from 'elo/back/core/Shared';

export class IsValid {
  static email(email: string): boolean {
    var re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
      return true;
    } else {
      EloConsole.devlog('IsValid.email: wrong');
      return false;
    }
  }

  static password(password: string): boolean {
    if (password.length > 7) {
      return true;
    } else {
      EloConsole.devlog('IsValid.password: wrong');
      return false;
    }
  }
}
