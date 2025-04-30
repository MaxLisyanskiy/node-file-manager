import { cwd } from "process";
import { ReadlineHandler } from "./handlers/ReadlineHandler.js";
import { FileSystemHandler } from "./handlers/FileSystemHandler.js";

export class App {
  constructor() {
    this.username = process.env.npm_config_username;
    this.currentDir = cwd();
    this.readlineHandler = new ReadlineHandler(this);
    this.fileSystemHandler = new FileSystemHandler(this);
  }

  init() {
    console.log(`\x1b[33m Welcome to the File Manager, ${this.username}! \x1b[0m \n`);
    this.printCurrentDir();
  }

  printGoodbye() {
    console.log(`\x1b[33m Thank you for using File Manager, ${this.username}, goodbye! \x1b[0m`);
  }

  printCurrentDir() {
    console.log(`You are currently in \x1b[32m ${this.currentDir} \x1b[0m`);
  }

  printInvalidInput(cmd) {
    console.log(`\x1b[31m Invalid input: "${cmd} \x1b[0m`);
  }

  printOperationFailed(operation) {
    console.log(`\x1b[31m Operation failed: ${operation} \x1b[0m`);
  }
}
