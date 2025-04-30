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
    this.readline.on("line", (cmd) => {
      if (cmd === ".exit") {
        this.readline.close();
        return;
      }

      console.log("Invalid input");
    });

    this.readline.on("close", () => {
      this.app.printGoodbye();
    });
  }
}
