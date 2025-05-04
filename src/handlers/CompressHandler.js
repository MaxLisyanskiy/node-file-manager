import { createReadStream, createWriteStream, promises as fsPromises } from "fs";
import { BrotliCompress, BrotliDecompress } from "zlib";
import { pipeline } from "stream";
import { promisify, styleText } from "util";
import { resolve, join, basename } from "path";

const pipelineAsync = promisify(pipeline);

// Test node commands
// 1) compress ./src/compressTest/compressFile.txt ./src/compressTest
// 2) decompress ./src/compressTest/compressFile.txt.br ./src/compressTest/compressFile123.txt

export class CompressHandler {
  constructor(appInstance) {
    this.app = appInstance;
  }

  async checkArePathsAccessed(sourcePath, destinationPath) {
    try {
      await fsPromises.access(sourcePath);
      await fsPromises.access(destinationPath);
    } catch ({ message }) {
      return this.app.printOperationFailed("compress", message);
    }
  }

  async getFinallyDecompress(sourcePath, destinationPath) {
    const sourceStream = createReadStream(sourcePath);
    const destinationStream = createWriteStream(destinationPath);
    const brotliStream = BrotliDecompress();

    try {
      await pipelineAsync(sourceStream, brotliStream, destinationStream);
      console.log(
        styleText(
          "bgGreen",
          `\n File "${sourcePath}" decompressed to "${destinationPath}" successfully!`
        )
      );
    } catch ({ message }) {
      return this.app.printOperationFailed("decompress", message);
    }
  }

  async compress(sourcePath, destinationPath) {
    const resolvedSourcePath = resolve(this.app.currentDir, sourcePath);
    const resolvedDestinationPath = resolve(this.app.currentDir, destinationPath);

    try {
      await this.checkArePathsAccessed(resolvedSourcePath, resolvedDestinationPath);
      const stats = await fsPromises.stat(resolvedSourcePath);
      if (stats.isDirectory()) {
        return console.error(
          `Source path "${resolvedSourcePath}" is a directory.
          Please provide a file to compress!`
        );
      }
    } catch ({ message }) {
      return this.app.printOperationFailed("compress", message);
    }

    let finalDestinationPath = resolvedDestinationPath;
    try {
      const destStats = await fsPromises.stat(resolvedDestinationPath);
      if (destStats.isDirectory()) {
        finalDestinationPath = join(resolvedDestinationPath, `${basename(resolvedSourcePath)}.br`);
      }
    } catch ({ code, message }) {
      if (code !== "ENOENT") {
        return this.app.printOperationFailed("compress", message);
      }
    }

    const sourceStream = createReadStream(resolvedSourcePath);
    const destinationStream = createWriteStream(finalDestinationPath);
    const brotliStream = BrotliCompress();

    try {
      await pipelineAsync(sourceStream, brotliStream, destinationStream);
      console.log(
        styleText(
          "bgGreen",
          `\n File "${resolvedSourcePath}" compressed to "${finalDestinationPath}" successfully!`
        )
      );
    } catch ({ message }) {
      return this.app.printOperationFailed("compress", message);
    }
  }

  async decompress(sourcePath, destinationPath) {
    const resolvedSourcePath = resolve(this.app.currentDir, sourcePath);
    const resolvedDestinationPath = resolve(this.app.currentDir, destinationPath);

    try {
      await this.checkArePathsAccessed(resolvedSourcePath, resolvedDestinationPath);
      const stats = await fsPromises.stat(resolvedSourcePath);
      if (stats.isDirectory()) {
        return console.error(
          `Source path "${resolvedSourcePath}" is a directory. 
          Please provide a file to decompress!`
        );
      }
    } catch ({ message }) {
      return this.app.printOperationFailed("decompress", message);
    }

    try {
      const destStats = await fsPromises.stat(resolvedDestinationPath);
      if (destStats.isDirectory()) {
        const fileName = basename(resolvedSourcePath, ".br");
        const finalDestinationPath = join(resolvedDestinationPath, fileName);
        await this.getFinallyDecompress(resolvedSourcePath, finalDestinationPath);
        return;
      }
    } catch ({ code, message }) {
      if (code !== "ENOENT") {
        return this.app.printOperationFailed("decompress", message);
      }
    }

    await this.getFinallyDecompress(resolvedSourcePath, resolvedDestinationPath);
  }
}
