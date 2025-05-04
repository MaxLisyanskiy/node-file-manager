import { cwd } from "process";
import { ReadlineHandler } from "./handlers/ReadlineHandler.js";
import { FileSystemHandler } from "./handlers/FileSystemHandler.js";
import { ReadableFileHandler } from "./handlers/ReadableFileHandler.js";
import { OSHandler } from "./handlers/OSHandler.js";
import { HashHandler } from "./handlers/HashHandler.js";
import { CompressHandler } from "./handlers/CompressHandler.js";
import { UsernameHandler } from "./handlers/UsernameHandler.js";

export class App {
  constructor() {
    this.username = new UsernameHandler().name;
    this.currentDir = cwd();
    this.readlineHandler = new ReadlineHandler(this);
    this.fileSystemHandler = new FileSystemHandler(this);
    this.readableFileHandler = new ReadableFileHandler(this);
    this.osHandler = new OSHandler(this);
    this.hashHandler = new HashHandler(this);
    this.compressHandler = new CompressHandler(this);
  }

  init() {
    console.log(`\x1b[33m Welcome to the File Manager, ${this.username}! \x1b[0m`);
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
