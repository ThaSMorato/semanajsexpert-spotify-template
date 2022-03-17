import { config } from "./config.js";
import { Controller } from "./controller.js";
import { Service } from "./service.js";
import { log } from "./utils.js";

const {
  location,
  pages: { homeHTML, controllerHTML },
  constants: { CONTENT_TYPE },
} = config;

const service = new Service();
const controller = new Controller({ service });

const routesOptions = (req, res) => ({
  "GET:/": () => {
    res.writeHead(302, {
      Location: location.home,
    });
    res.end();
  },
  "GET:/home": async () => {
    const { stream, type } = await controller.getFileStream(homeHTML);

    res.writeHead(200, {
      "Content-Type": CONTENT_TYPE[type],
    });

    stream.pipe(res);
  },
  "GET:/controller": async () => {
    const { stream, type } = await controller.getFileStream(controllerHTML);

    res.writeHead(200, {
      "Content-Type": CONTENT_TYPE[type],
    });

    stream.pipe(res);
  },
  defaultGET: async (url) => {
    const { stream, type } = await controller.getFileStream(url);
    if (Reflect.has(CONTENT_TYPE, type)) {
      res.writeHead(200, {
        "Content-Type": CONTENT_TYPE[type],
      });
    }

    stream.pipe(res);
  },
  default: () => {
    res.writeHead(404);
    res.end();
  },
});

async function routes(req, res) {
  const { method, url } = req;
  const routes = routesOptions(req, res);
  const route = `${method}:${url}`;
  if (Reflect.has(routes, route)) {
    return routes[route]();
  }

  if (method === "GET") {
    return routes.defaultGET(url);
  }

  return routes.default();
}

const handleError = (error, res) => {
  if (error.message.includes("ENOENT")) {
    log.warn(`asset not found ${error.stack}`);
    res.writeHead(404);
    return res.end();
  }

  log.error(`caught error on API ${error.stack}`);
  res.writeHead(500);
  return res.end();
};

export const handler = (resquest, response) => {
  return routes(resquest, response).catch((error) => handleError(error, response));
};
