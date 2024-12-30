export class IsValid {
  static email(email: string): boolean {
    var re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
      return true;
    } else {
      console.error('IsValid.email: wrong');
      return false;
    }
  }

  static password(password: string): boolean {
    if (password.length > 7) {
      return true;
    } else {
      console.error('IsValid.password: wrong');
      return false;
    }
  }
}
