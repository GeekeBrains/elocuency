export class EloConsole {
  static log(message: string) {
    console.log(message);
  }

  // Only show if its active de dev mode, on production by default its off
  static devlog(params: any) {
    console.log(params);
  }
}
