import { EOL, cpus, homedir, userInfo, arch } from "node:os";

export class OSHandler {
  constructor(appInstance) {
    this.app = appInstance;
  }

  getOption(option) {
    if (option === "--EOL") {
      this.getEOL();
    } else if (option === "--cpus") {
      this.getCPUs();
    } else if (option === "--homedir") {
      this.getHomeDir();
    } else if (option === "--username") {
      this.getUsername();
    } else if (option === "--architecture") {
      this.getArchitecture();
    } else {
      return "unknown";
    }
  }

  getEOL() {
    try {
      console.log(`Default system End-Of-Line: ${JSON.stringify(EOL)}`);
    } catch ({ message }) {
      this.app.printOperationFailed("os --EOL", message);
    }
  }

  getCPUs() {
    try {
      const cpuInfo = cpus();
      console.log(`Total CPUs: ${cpuInfo.length}`);
      cpuInfo.forEach((cpu, index) => {
        console.log(
          `CPU ${index + 1}: Model - ${cpu.model}, Speed - ${(cpu.speed / 1000).toFixed(2)} GHz`
        );
      });
    } catch ({ message }) {
      this.app.printOperationFailed("os --cpus", message);
    }
  }

  getHomeDir() {
    try {
      console.log(`Home directory: ${homedir()}`);
    } catch ({ message }) {
      this.app.printOperationFailed("os --homedir", message);
    }
  }

  getUsername() {
    try {
      const user = userInfo();
      console.log(`Current system user name: ${user.username}`);
    } catch ({ message }) {
      this.app.printOperationFailed("os --username", message);
    }
  }

  getArchitecture() {
    try {
      console.log(`CPU architecture: ${arch()}`);
    } catch ({ message }) {
      this.app.printOperationFailed("os --username", message);
    }
  }
}
