export interface ResourceRegistry {
  /** Named shared services (theme, caches, clients). */
  [name: string]: unknown;
}
