import { dirname, join, resolve } from "path";
import { readdirSync, statSync, existsSync } from "fs";

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

  cd(path) {
    const newPath = resolve(this.app.currentDir, path);

    if (existsSync(newPath) && statSync(newPath).isDirectory()) {
      this.app.currentDir = newPath;
    } else {
      this.app.printOperationFailed(`cd. Invalid path: ${path}`);
    }
  }

  ls() {
    const currentDir = this.app.currentDir;

    try {
      const files = readdirSync(currentDir);

      const fileDetails = files.map((file) => {
        const filePath = join(currentDir, file);
        const isDirectory = statSync(filePath).isDirectory();
        return {
          name: file,
          type: isDirectory ? "directory" : "file",
        };
      });

      const sortedFiles = fileDetails.sort((a, b) => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "directory") return 1;
        return a.name.localeCompare(b.name);
      });

      function TableColumns(name, type) {
        this.name = name;
        this.type = type;
      }

      sortedFiles.map((file) => {
        return new TableColumns(file.name, file.type);
      });

      console.table(sortedFiles);
    } catch (error) {
      this.app.printOperationFailed("ls");
    }
  }
}
