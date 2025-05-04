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
    this.readline.on("line", async (command) => {
      const [cmd, ...args] = command.split(" ");

      if (cmd === ".exit") {
        return this.readline.close();
      }

      if (cmd === "up") {
        this.app.fileSystemHandler.up();
        return this.app.printCurrentDir();
      }

      if (cmd.startsWith("cd")) {
        const filePath = args[0];
        if (filePath || filePath.trim() !== "") {
          this.app.fileSystemHandler.cd(filePath);
          return this.app.printCurrentDir();
        }
      }

      if (cmd === "ls") {
        this.app.fileSystemHandler.ls();
        return this.app.printCurrentDir();
      }

      if (cmd === "cat") {
        const filePath = args[0];
        await this.app.readableFileHandler.cat(filePath);
        return this.app.printCurrentDir();
      }

      if (cmd === "add") {
        const fileName = args[0];
        await this.app.readableFileHandler.add(fileName);
        return this.app.printCurrentDir();
      }

      if (cmd === "mkdir") {
        const dirName = args[0];
        await this.app.readableFileHandler.mkdir(dirName);
        return this.app.printCurrentDir();
      }

      if (cmd === "rn") {
        const [oldPath, newFileName] = args;
        await this.app.readableFileHandler.rn(oldPath, newFileName);
        return this.app.printCurrentDir();
      }

      if (cmd === "cp") {
        const [sourcePath, destinationPath] = args;
        await this.app.readableFileHandler.cp(sourcePath, destinationPath);
        return this.app.printCurrentDir();
      }

      if (cmd === "mv") {
        const [sourcePath, destinationPath] = args;
        await this.app.readableFileHandler.mv(sourcePath, destinationPath);
        return this.app.printCurrentDir();
      }

      if (cmd === "rm") {
        const filePath = args[0];
        await this.app.readableFileHandler.rm(filePath);
        return this.app.printCurrentDir();
      }

      if (cmd.startsWith("os")) {
        const option = args[0];
        const fallback = this.app.osHandler.getOption(option);

        if (fallback !== "unknown") {
          return this.app.printCurrentDir();
        }
      }

      if (cmd === "hash") {
        const filePath = args[0];

        if (filePath || filePath.trim() !== "") {
          this.app.hashHandler.hash(filePath);
          return this.app.printCurrentDir();
        }
      }

      if (cmd === "hash") {
        const filePath = args[0];

        if (filePath || filePath.trim() !== "") {
          this.app.hashHandler.hash(filePath);
          return this.app.printCurrentDir();
        }
      }

      if (cmd === "compress") {
        const [sourcePath, destinationPath] = args;

        const isSourcePathValid = sourcePath || sourcePath.trim() !== "";
        const isDestinationPathValid = destinationPath || destinationPath.trim() !== "";

        if (isSourcePathValid && isDestinationPathValid) {
          await this.app.compressHandler.compress(sourcePath, destinationPath);
          return this.app.printCurrentDir();
        }
      }

      if (cmd === "decompress") {
        const [sourcePath, destinationPath] = args;

        const isSourcePathValid = sourcePath || sourcePath.trim() !== "";
        const isDestinationPathValid = destinationPath || destinationPath.trim() !== "";

        if (isSourcePathValid && isDestinationPathValid) {
          await this.app.compressHandler.decompress(sourcePath, destinationPath);
          return this.app.printCurrentDir();
        }
      }

      this.app.printInvalidInput(cmd);
    });

    this.readline.on("close", () => {
      this.app.printGoodbye();
    });
  }
}
