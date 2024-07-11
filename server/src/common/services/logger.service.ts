export class logger {
  info(message: string) {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }
}

export default new logger();
