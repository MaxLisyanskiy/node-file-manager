import { cwd } from "process";
import { ReadlineHandler } from "./handlers/ReadlineHandler.js";

export class App {
  constructor() {
    this.username = process.env.npm_config_username;
    this.currentDir = cwd();
    this.readlineHandler = new ReadlineHandler(this);
  }

  init() {
    console.log(`Welcome to the File Manager, ${this.username}!`);
    this.printCurrentDir();
  }

  printGoodbye() {
    console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
  }

  printCurrentDir() {
    console.log(`You are currently in ${this.currentDir}`);
  }
}
