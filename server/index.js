import "dotenv/config";
import { config } from "./config.js";
import { server } from "./server.js";
import { log } from "./utils.js";

const { port } = config;

server.listen(port).on("listening", () => log.info(`listening on ${port}`));
