export interface ProjectConfig {
  /**
   * The unique name of the project.
   * Used for identification in the workspace and CLI commands.
   * If not provided, the directory name will be used as a fallback.
   */
  name?: string;

  /**
   * The type of the project.
   * - `app`: An application that can be built and deployed (e.g., Next.js, Vite).
   * - `lib`: A library that is consumed by other projects or published to a registry.
   */
  type?: "app" | "lib";
}
