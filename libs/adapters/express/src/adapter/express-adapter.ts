import express from "express";

import { defineAdapter } from "@fluxora/utils/node";
import { ExpressAdapter } from "@nestjs/platform-express";

import { optimizeDepsPlugin } from "./plugins/optimize-deps.plugin";

export const adapterName = "@fluxora/adapter-express";

export default defineAdapter({
  name: adapterName,

  vite: {
    plugins: [optimizeDepsPlugin()]
  },

  nestjs: {
    adapter() {
      return new ExpressAdapter(this.instance);
    }
  },

  server: {
    instance: express,

    use(...middlewares) {
      this.instance.use(...middlewares);
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
    },

    handler() {
      return this.instance;
    }
  }
});
