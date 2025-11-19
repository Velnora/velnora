/** Renderer/adapter tuning flags a caller can pass as hints. */
export interface RenderHints {
  allowCache?: boolean; // opt-in cache use if renderer supports it
  debugITree?: boolean; // ask renderer to snapshot/emit intermediate tree
  ssr?: boolean; // prefer server-side rendering path
  hydrate?: boolean; // client hydration desired (if applicable)
  streaming?: boolean; // allow streaming responses if adapter supports
}
