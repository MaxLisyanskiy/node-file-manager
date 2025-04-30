import { createHash } from "crypto";
import { promises as fsPromises } from "fs";
import { resolve } from "path";

export class HashHandler {
  constructor(appInstance) {
    this.app = appInstance;
  }

  async hash(filePath) {
    try {
      const fullPath = resolve(this.app.currentDir, filePath);
      const hash = createHash("sha256");
      const fileBuffer = await fsPromises.readFile(fullPath);
      hash.update(fileBuffer);
      const hashValue = hash.digest("hex");
      console.log(`Hash of file "${filePath}": ${hashValue}`);
    } catch ({ message }) {
      const error = `Error when calculating hash for file "${filePath}": ${message}`;
      this.app.printOperationFailed("hash", error);
    }
  }
}
