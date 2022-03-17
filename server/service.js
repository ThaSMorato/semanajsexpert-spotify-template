import fs from "fs";
import fsPromises from "fs/promises";
import { join, extname } from "path";

import { config } from "./config.js";

const {
  dirs: { publicDir },
} = config;

export class Service {
  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(file) {
    const fullFilePath = join(publicDir, file);
    await fsPromises.access(fullFilePath);
    const fileType = extname(fullFilePath);

    return { type: fileType, name: fullFilePath };
  }

  async getFileStream(file) {
    const { type, name } = await this.getFileInfo(file);

    return {
      type,
      stream: this.createFileStream(name),
    };
  }
}
