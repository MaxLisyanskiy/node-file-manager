import { createReadStream, createWriteStream, promises as fsPromises } from "fs";
import { pipeline } from "stream";
import { promisify, styleText } from "util";
import { resolve, basename } from "path";

const pipelineAsync = promisify(pipeline);

// Test node commands
// 1) cat .\src\test\readble\readMe.txt
// 2) add .\src\test\readble\newFile.txt
// 3) mkdir .\src\test\readble\newFolder
// 4) rn .\src\test\readble\renameMe.txt newRenameMe.txt
// 5.1) cp .\src\test\readble\copyMe.txt .\src\test\readble\newCopyFolder
// 5.2) cp .\src\test\readble\copyMe.txt newCopyFolder
// 6.1) mv .\src\test\readble\moveMe.txt .\src\test\readble\newMoveFolder
// 6.2) mv .\src\test\readble\moveMe.txt newMoveFolder
// 7) rm .\src\test\readble\deleteMe.txt

export class ReadableFileHandler {
  constructor(appInstance) {
    this.app = appInstance;
  }

  printText(text) {
    console.log(styleText("bgGreen", "\n" + text));
  }

  async cat(filePath) {
    try {
      const resolvedPath = resolve(this.app.currentDir, filePath);
      const readStream = createReadStream(resolvedPath);

      readStream.on("error", ({ message }) => {
        this.app.printOperationFailed("cat", message);
      });

      readStream.pipe(process.stdout);

      readStream.on("end", () => console.log("\n"));
    } catch ({ message }) {
      this.app.printOperationFailed("mkdir", message);
    }
  }

  async add(fileName) {
    try {
      const resolvedPath = resolve(this.app.currentDir, fileName);

      await fsPromises.writeFile(resolvedPath, "");
      this.printText(`File "${fileName}" created successfully.`);
    } catch ({ message }) {
      this.app.printOperationFailed("mkdir", message);
    }
  }

  async mkdir(directoryName) {
    try {
      const resolvedPath = resolve(this.app.currentDir, directoryName);

      await fsPromises.mkdir(resolvedPath);
      this.printText(`Directory "${directoryName}" created successfully.`);
    } catch ({ message }) {
      this.app.printOperationFailed("mkdir", message);
    }
  }

  async rn(oldPath, newFileName) {
    try {
      const resolvedOldPath = resolve(this.app.currentDir, oldPath);
      const resolvedNewPath = resolve(this.app.currentDir, newFileName);

      await fsPromises.rename(resolvedOldPath, resolvedNewPath);
      this.printText(`File renamed from "${oldPath}" to "${newFileName}" successfully.`);
    } catch ({ message }) {
      this.app.printOperationFailed("rn", message);
    }
  }

  async cp(sourcePath, destinationPath, print = true) {
    try {
      const resolvedSourcePath = resolve(this.app.currentDir, sourcePath);
      const resolvedDestinationPath = resolve(this.app.currentDir, destinationPath);

      const destinationFileName = basename(resolvedSourcePath);
      const finalDestinationPath = resolve(resolvedDestinationPath, destinationFileName);

      try {
        await fsPromises.access(resolvedDestinationPath);
      } catch {
        await fsPromises.mkdir(resolvedDestinationPath, { recursive: true });
      }

      const readStream = createReadStream(resolvedSourcePath);
      const writeStream = createWriteStream(finalDestinationPath);

      await pipelineAsync(readStream, writeStream);
      print &&
        console.log(`File copied from "${sourcePath}" to "${finalDestinationPath}" successfully.`);
    } catch ({ message }) {
      this.app.printOperationFailed("cp", message);
    }
  }

  async mv(sourcePath, destinationPath) {
    try {
      await this.cp(sourcePath, destinationPath, false);
      await this.rm(sourcePath, false);

      this.printText(`File moved from "${sourcePath}" to "${destinationPath}" successfully.`);
    } catch ({ message }) {
      this.app.printOperationFailed("mv", message);
    }
  }

  async rm(filePath, print = true) {
    try {
      const resolvedPath = resolve(this.app.currentDir, filePath);
      await fsPromises.unlink(resolvedPath);

      print && this.printText(`File "${filePath}" deleted successfully.`);
    } catch ({ message }) {
      this.app.printOperationFailed("rm", message);
    }
  }
}
