import { jest, expect, describe, it, beforeEach } from "@jest/globals";
import { config } from "../../../server/config";
import { Controller } from "../../../server/controller";
import { handler } from "../../../server/routes";
import { TestUtil } from "../_util/testUtil";

const {
  pages: { controllerHTML, homeHTML },
  location,
  constants: { CONTENT_TYPE },
} = config;

describe("#Routes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("GET / - should redirect to home page", async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = "/";

    await handler(...params.values());

    expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toHaveBeenCalled();
    expect(params.response.writeHead).toBeCalledWith(302, { Location: location.home });
  });

  it(`GET /home - should response with ${homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = "/home";
    const mockFileStream = TestUtil.generateReadableStream(["data"]);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({ stream: mockFileStream, type: ".html" });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    // expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toBeCalledWith(200, {
      "Content-Type": CONTENT_TYPE[".html"],
    });
    expect(Controller.prototype.getFileStream).toBeCalledWith(homeHTML);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  it(`GET /controller - should response with ${controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "GET";
    params.request.url = "/controller";
    const mockFileStream = TestUtil.generateReadableStream(["data"]);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({ stream: mockFileStream, type: ".html" });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    // expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toBeCalledWith(200, {
      "Content-Type": CONTENT_TYPE[".html"],
    });
    expect(Controller.prototype.getFileStream).toBeCalledWith(controllerHTML);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  it(`GET /file.css - should response with file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const fileName = "/file.css";
    params.request.method = "GET";
    params.request.url = fileName;
    const mockFileStream = TestUtil.generateReadableStream(["data"]);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({ stream: mockFileStream, type: ".css" });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    // expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toBeCalledWith(200, {
      "Content-Type": CONTENT_TYPE[".css"],
    });
    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  it(`GET /file.ext - should response with file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const fileName = "/file.ext";
    params.request.method = "GET";
    params.request.url = fileName;
    const mockFileStream = TestUtil.generateReadableStream(["data"]);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({ stream: mockFileStream, type: "ext" });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    // expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).not.toHaveBeenCalled();
    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  it(`POST /unknown - given an inexistent route it should response with 404`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = "POST";
    params.request.url = "/UNKNOWN";

    await handler(...params.values());

    expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toBeCalledWith(404);
  });

  describe("Exceptions", () => {
    it("Given an inexistent file it should respond with 404", async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = "GET";
      params.request.url = "/UNKNOWN.ext";

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error("Error: ENOENT: no such file"));

      await handler(...params.values());

      expect(params.response.end).toHaveBeenCalled();
      expect(params.response.writeHead).toBeCalledWith(404);
    });

    it("Given an error it should respond with 500", async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = "GET";
      params.request.url = "/UNKNOWN";

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error("Error:"));

      await handler(...params.values());

      expect(params.response.end).toHaveBeenCalled();
      expect(params.response.writeHead).toBeCalledWith(500);
    });
  });
});
