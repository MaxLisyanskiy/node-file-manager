import { dirname, join, resolve } from "path";
import { promises as fsPromises } from "fs";

export class FileSystemHandler {
  constructor(appInstance) {
    this.app = appInstance;
  }

  up() {
    const currentDir = this.app.currentDir;
    const parentDir = dirname(this.app.currentDir);

    if (currentDir === parentDir) return;

    this.app.currentDir = parentDir;
  }

  async cd(path) {
    const fullPath = resolve(this.app.currentDir, path);

    try {
      await fsPromises.access(fullPath);
    } catch (e) {
      return this.app.printOperationFailed(`cd. ${path} does not exist`);
    }

    try {
      const stats = await fsPromises.stat(fullPath);
      if (!stats.isDirectory()) {
        return this.app.printOperationFailed(`cd. ${path} is not a directory`);
      }
    } catch (e) {
      return this.app.printOperationFailed(`cd. Unable to access ${path}`);
    }

    this.app.currentDir = fullPath;
  }

  async ls() {
    const currentDir = this.app.currentDir;

    try {
      const files = await fsPromises.readdir(currentDir);

      const fileDetailsPromises = files.map(async (file) => {
        const filePath = join(currentDir, file);
        const stats = await fsPromises.stat(filePath);
        const isDirectory = stats.isDirectory();
        return {
          name: file,
          type: isDirectory ? "directory" : "file",
        };
      });

      const fileDetails = await Promise.all(fileDetailsPromises);

      const sortedFiles = fileDetails.sort((a, b) => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "directory") return 1;
        return a.name.localeCompare(b.name);
      });

      function TableColumns(name, type) {
        this.name = name;
        this.type = type;
      }

      const tableColumns = sortedFiles.map((file) => new TableColumns(file.name, file.type));

      console.table(tableColumns);
    } catch ({ message }) {
      this.app.printOperationFailed("ls", message);
    }
  }
}
