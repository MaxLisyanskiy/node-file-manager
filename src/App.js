import { cwd } from "process";
import { ReadlineHandler } from "./handlers/ReadlineHandler.js";
import { FileSystemHandler } from "./handlers/FileSystemHandler.js";
import { OSHandler } from "./handlers/OSHandler.js";

export class App {
  constructor() {
    this.username = process.env.npm_config_username;
    this.currentDir = cwd();
    this.readlineHandler = new ReadlineHandler(this);
    this.fileSystemHandler = new FileSystemHandler(this);
    this.osHandler = new OSHandler(this);
  }

  init() {
    console.log(`\x1b[33m Welcome to the File Manager, ${this.username}! \x1b[0m \n`);
    this.printCurrentDir();
  }

  printGoodbye() {
    console.log(
      `\n \x1b[33m Thank you for using File Manager, ${this.username}, goodbye! \x1b[0m \n`
    );
  }

  printCurrentDir() {
    console.log(`\n You are currently in \x1b[32m ${this.currentDir} \x1b[0m \n`);
  }

  printInvalidInput(cmd) {
    console.log(`\x1b[31m Invalid input: ${cmd} \x1b[0m`);
  }

  printOperationFailed(operation, err) {
    console.log(`\x1b[31m Operation failed: ${operation} \x1b[0m`);
    if (err) console.log(`Error: ${err}`);
  }
}
