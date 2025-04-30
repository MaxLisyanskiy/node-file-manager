import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

export class ReadlineHandler {
  constructor(appInstance) {
    this.app = appInstance;
    this.readline = createInterface({
      input: stdin,
      output: stdout,
    });

    this.setupListeners();
  }

  setupListeners() {
    this.readline.on("line", (command) => {
      const [cmd, ...args] = command.split(" ");

      if (cmd === ".exit") {
        return this.readline.close();
      }

      if (cmd === "up") {
        this.app.fileSystemHandler.up();
        return this.app.printCurrentDir();
      }

      if (cmd.startsWith("cd")) {
        const path = args.join(" ");
        this.app.fileSystemHandler.cd(path);
        return this.app.printCurrentDir();
      }

      if (cmd === "ls") {
        this.app.fileSystemHandler.ls();
        return this.app.printCurrentDir();
      }

      this.app.printInvalidInput(cmd);
    });

    this.readline.on("close", () => {
      this.app.printGoodbye();
    });
  }
}
