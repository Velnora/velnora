import type { AdapterServer } from "./adapter-server";
import type { NestJsAdapterOptions } from "./nest-js-adapter.options";
import type { ViteAdapterOptions } from "./vite-adapter.options";

export interface FluxoraAdapter<TInstance = any> {
  name: string;

  nestjs: NestJsAdapterOptions<TInstance>;
  vite: ViteAdapterOptions;
  server: AdapterServer<TInstance>;
}

export interface PartialFluxoraAdapter<TInstance = any>
  extends Pick<FluxoraAdapter<TInstance>, "name" | "server">,
    Partial<Omit<FluxoraAdapter<TInstance>, "name" | "server" | "vite">> {
  vite?: Partial<ViteAdapterOptions>;
}
