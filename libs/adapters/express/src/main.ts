import express from "express";

import { ExpressAdapter } from "@nestjs/platform-express";
import { defineAdapter } from "@velnora/utils/node";

import { optimizeDepsPlugin } from "./plugins/optimize-deps.plugin";

export default defineAdapter({
  name: "@velnora/adapter-express",

  vite: {
    plugins: [optimizeDepsPlugin()]
  },

  nestjs: {
    adapter() {
      return new ExpressAdapter(this.instance);
    }
  },

  server: {
    instance() {
      const app = express();
      app.set("x-powered-by", false);
      return app;
    },

    use(...middlewares) {
      const [middlewareOrPath, ...allMiddlewares] = middlewares;
      if (typeof middlewareOrPath === "string") {
        return this.instance.use(middlewareOrPath, ...allMiddlewares);
      }
      this.instance.use(middlewareOrPath, ...allMiddlewares);
    },

    get(path, ...handlers) {
      this.instance.get(path, ...handlers);
    },

    post(path, ...handlers) {
      this.instance.post(path, ...handlers);
    },

    put(path, ...handlers) {
      this.instance.put(path, ...handlers);
    },

    patch(path, ...handlers) {
      this.instance.patch(path, ...handlers);
    },

    delete(path, ...handlers) {
      this.instance.delete(path, ...handlers);
    }
  }
});
