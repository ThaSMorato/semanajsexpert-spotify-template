import { jest, expect, describe, it, beforeEach } from "@jest/globals";
import { Service } from "../../../server/service";
import { TestUtil } from "../_util/testUtil";
import fs from "fs";
import { config } from "../../../server/config";
import fsPromises from "fs/promises";

const {
  dirs: { publicDir },
} = config;
let service = {};

describe("#Service", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    service = new Service();
  });

  it("createFileStream - should create a fileStream from file", async () => {
    const fileStream = TestUtil.generateReadableStream(["file"]);
    const fileName = "AFileName.ext";

    jest.spyOn(fs, fs.createReadStream.name).mockResolvedValue(fileStream);

    const result = await service.createFileStream(fileName);

    expect(fs.createReadStream).toBeCalledWith(fileName);
    expect(result).toEqual(fileStream);
  });

  it("getFileInfo - should return the file info", async () => {
    const fileName = "AFileName.ext";
    const extension = ".ext";
    const fullFilePath = `${publicDir}\\${fileName}`;
    const expected = {
      type: extension,
      name: fullFilePath,
    };

    jest.spyOn(fsPromises, fsPromises.access.name).mockResolvedValue(true);

    const result = await service.getFileInfo(fileName);

    expect(fsPromises.access).toBeCalledWith(fullFilePath);

    expect(result).toEqual(expected);
  });

  it("getFileStream - should return the stream file and info", async () => {
    const fileStream = TestUtil.generateReadableStream(["file"]);
    const fileName = "AFileName.ext";
    const extension = ".ext";
    const fullFilePath = `${publicDir}\\${fileName}`;
    const fileInfo = {
      type: extension,
      name: fullFilePath,
    };

    const expected = {
      type: extension,
      stream: fileStream,
    };

    jest
      .spyOn(Service.prototype, Service.prototype.createFileStream.name)
      .mockReturnValue(fileStream);

    jest.spyOn(Service.prototype, Service.prototype.getFileInfo.name).mockResolvedValue(fileInfo);

    const result = await service.getFileStream(fileName);

    expect(Service.prototype.createFileStream).toBeCalledWith(fullFilePath);
    expect(Service.prototype.getFileInfo).toBeCalledWith(fileName);

    expect(result).toEqual(expected);
  });
});
