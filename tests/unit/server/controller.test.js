import { jest, expect, describe, it, beforeEach } from "@jest/globals";
import { Controller } from "../../../server/controller";
import { TestUtil } from "../_util/testUtil";

const serviceMock = TestUtil.mockService();
let controller = {};

describe("#Controller", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    controller = new Controller({ service: serviceMock });
  });

  it("should be created with a service object", () => {
    expect(controller.service).toEqual(serviceMock);
  });

  it("should call service.getFileStream on Controller.getFileStream", async () => {
    const fileStream = TestUtil.generateReadableStream(["file"]);
    const fileName = "AFileName.ext";
    serviceMock.getFileStream.mockResolvedValue(fileStream);
    const result = await controller.getFileStream(fileName);

    expect(serviceMock.getFileStream).toBeCalledWith(fileName);
    expect(result).toEqual(fileStream);
  });
});
