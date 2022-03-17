import { join, dirname } from "path";
import { fileURLToPath } from "url";

const currentDirname = dirname(fileURLToPath(import.meta.url));
const root = join(currentDirname, "../");

const audioDir = join(root, "audio");
const publicDir = join(root, "public");

export const config = {
  port: process.env.PORT || 3000,
  dirs: {
    root,
    audioDir,
    publicDir,
    songsDir: join(audioDir, "songs"),
    fxDir: join(audioDir, "fx"),
  },
  pages: {
    homeHTML: "home/index.html",
    controllerHTML: "controller/index.html",
  },
  location: {
    home: "/home",
  },
  constants: {
    CONTENT_TYPE: {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    },
  },
};
