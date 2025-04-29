export default class App {
  username = "";

  constructor() {
    this.username = process.env.npm_config_username;
  }

  init = () => {
    console.log(`Welcome to the File Manager, ${this.username}!`);
  };
}
