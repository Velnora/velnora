export interface VelnoraHooks {
  /**
   * Hook to be called when the application server side hmr is triggered
   * and the application needs to be reinitialized.
   * @param app
   */
  "velnora:app-server:nestjs:reinit"(app: string): Promise<void>;
}
