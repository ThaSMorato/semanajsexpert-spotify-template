export class Controller {
  constructor({ service }) {
    this.service = service;
  }

  async getFileStream(fileName) {
    return this.service.getFileStream(fileName);
  }
}
