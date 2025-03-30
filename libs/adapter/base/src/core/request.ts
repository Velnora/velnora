import { IncomingMessage } from "node:http";

import type { ParseUrlParams } from "../types/parse-url-params";

export abstract class Request<TPath = any> extends IncomingMessage {
  /**
   * Returns the protocol string `"http"` or `"https"`.
   *
   * - If the request is made over TLS, it returns `"https"`.
   * - When the `"trust proxy"` setting is enabled, the `"X-Forwarded-Proto"` header
   *   is trusted. This is useful when running behind a reverse proxy that handles HTTPS.
   *
   * @example
   * request.protocol // "https"
   */
  declare readonly protocol: string;

  /**
   * Shorthand for checking if the request is secure.
   *
   * Equivalent to:
   * ```ts
   * request.protocol === "https"
   * ```
   *
   * @example
   * request.secure // true (if HTTPS), false (if HTTP)
   */
  declare readonly secure: boolean;

  /**
   * Returns the remote address of the client.
   *
   * - If `"trust proxy"` is `true`, it returns the upstream address.
   * - If the `req.socket` is destroyed (e.g., client disconnected), the value may be `undefined`.
   *
   * @example
   * request.ip // "192.168.1.1"
   */
  declare readonly ip?: string;

  /**
   * Returns an array of IP addresses in the request chain.
   *
   * - When `"trust proxy"` is `true`, it parses the `"X-Forwarded-For"` header.
   * - The first entry is the original client IP, followed by proxy addresses.
   *
   * @example
   * // "X-Forwarded-For: client, proxy1, proxy2"
   * request.ips // ["client", "proxy1", "proxy2"]
   */
  declare readonly ips: string[];

  /**
   * Returns subdomains as an array.
   *
   * - Subdomains are extracted from the hostname.
   * - By default, the domain is assumed to be the last two parts of the hostname.
   * - This behavior can be customized using the `"subdomain offset"` setting.
   *
   * @example
   * // Given "api.shop.example.com":
   * request.subdomains // ["shop", "api"]
   */
  declare readonly subdomains: string[];

  /**
   * The pathname of the request URL.
   *
   * Equivalent to:
   * ```ts
   * new URL(req.url).pathname
   * ```
   *
   * @example
   * request.path // "/users/123"
   */
  declare readonly path: string;

  /**
   * The original requested URL.
   */
  declare readonly originalUrl: string;

  /**
   * The hostname from the `Host` HTTP header.
   *
   * - This excludes the port number.
   *
   * @example
   * request.hostname // "example.com"
   */
  declare readonly hostname?: string;

  /**
   * The full host from the `Host` HTTP header.
   *
   * - This includes the port number if specified.
   *
   * @example
   * request.host // "example.com:3000"
   */
  declare readonly host?: string;

  /**
   * Indicates whether the request is fresh.
   *
   * - A request is considered **fresh** if the `ETag` or `Last-Modified`
   *   headers match the client's cache.
   * - This is useful for conditional GET requests.
   *
   * @example
   * request.fresh // true (if not modified), false (if modified)
   */
  declare readonly fresh: boolean;

  /**
   * Indicates whether the request is stale.
   *
   * - A request is **stale** if the `ETag` or `Last-Modified` headers do not match.
   * - Essentially, `stale` is the opposite of `fresh`.
   *
   * @example
   * request.stale // true (if modified), false (if not modified)
   */
  declare readonly stale: boolean;

  /**
   * Indicates whether the request was made using an XMLHttpRequest (AJAX).
   *
   * - This checks the `"X-Requested-With"` HTTP header.
   *
   * @example
   * request.xhr // true (if an AJAX request), false (otherwise)
   */
  declare readonly xhr: boolean;

  /**
   * Parsed route parameters from the request URL.
   *
   * - If the request matches a predefined route pattern, this object contains
   *   key-value pairs of extracted parameters.
   * - When `TPath` is a string or RegExp, it returns extracted parameters as `ParsedUrl<TPath>["params"]`.
   * - Otherwise, it defaults to `string`.
   *
   * @example
   * // Given a route definition: "/users/:id"
   * request.params // { id: "123" }
   *
   * @example
   * // If `TPath` is not defined or does not match a known route
   * request.params // "some value"
   */
  declare readonly params: TPath extends string | RegExp ? ParseUrlParams<TPath> : string;

  /**
   * Gets or sets a header value.
   */
  abstract header(name: "set-cookie"): string[] | undefined;
  abstract header(name: "set-cookie", value: string | string[]): string | undefined;

  abstract header(name: "content-type"): string | undefined;
  abstract header(name: "content-type", value: string): string | undefined;

  abstract header(name: "content-length"): string | undefined;
  abstract header(name: "content-length", value: string): string | undefined;

  abstract header(name: string): string | undefined;
  abstract header(name: string, value: string | string[]): void;

  abstract header(name: string, value?: string | string[]): string | undefined;
}
