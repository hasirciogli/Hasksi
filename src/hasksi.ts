import request from "request";
import { load as CheerioLoad, CheerioAPI } from "cheerio";
import { randomUUID } from "crypto";
/**
 * Hasksi
 */
export class HasksiHeaders {
  private headers: { [key: string]: string };

  constructor(headers: { [key: string]: string }) {
    this.headers = headers;
  }

  // if key equals to "set-cookie", return type an array of cookies
  get(key: string): string | string[] | undefined {
    key = key.toLowerCase();
    return this.headers[key];
  }

  set(key: string, value: string): void {
    key = key.toLowerCase();
    this.headers[key] = value;
  }

  delete(key: string): void {
    key = key.toLowerCase();
    delete this.headers[key];
  }

  clear(): void {
    this.headers = {};
  }

  has(key: string): boolean {
    key = key.toLowerCase();
    return key in this.headers;
  }

  keys(): string[] {
    return Object.keys(this.headers);
  }

  values(): string[] {
    return Object.values(this.headers);
  }

  entries(): [string, string][] {
    return Object.entries(this.headers);
  }

  each(callback: (key: string, value: string) => void): void {
    Object.entries(this.headers).forEach(([key, value]) =>
      callback(key, value)
    );
  }

  toString(): string {
    return JSON.stringify(this.headers);
  }

  toJSON(): { [key: string]: string } {
    return this.headers;
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries()[Symbol.iterator]();
  }
}

export class HasksiCookies {
  // cookielerde path ve zaman gibi tüm herşey olmalı
  private cookies: {
    [key: string]: {
      value: string;
      path?: string;
      domain?: string;
      expires?: Date;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    };
  } = {};

  get(key: string): string | undefined {
    // decrypt cookie value if it is encrypted
    return decodeURIComponent(this.cookies[key]?.value);
  }

  set(
    key: string,
    value: string,
    options: {
      path?: string;
      domain?: string;
      expires?: Date;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    } = {}
  ): void {
    value = encodeURIComponent(value);
    this.cookies[key] = { value, ...options };
  }

  readyCookies(): string {
    return Object.entries(this.cookies)
      .map(([key, data]) => {
        return `${key}=${data.value}`;
      })
      .join("; ");
  }

  processResponseCookies(cookies: string[]): void {
    cookies.forEach((cookie) => {
      const [key, value] = cookie.split(";")[0].split("=");
      this.cookies[key] = { value, ...{} };
    });
  }
}

export class HasksiProxy {
  private host: string | undefined;
  private port: number | undefined;
  private username: string | undefined;
  private password: string | undefined;
  private sessionId: string | undefined;

  constructor(
    host: string,
    port: number,
    username: string,
    password: string,
    sessionId: string
  ) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.sessionId = sessionId;
  }

  get Host(): string | undefined {
    return this.host;
  }

  get Port(): number | undefined {
    return this.port;
  }

  get Username(): string | undefined {
    return this.username;
  }

  get Password(): string | undefined {
    return this.password;
  }

  get SessionId(): string | undefined {
    return this.sessionId;
  }

  set Host(host: string) {
    this.host = host;
  }

  set Port(port: number) {
    this.port = port;
  }

  set Username(username: string) {
    this.username = username;
  }

  set Password(password: string) {
    this.password = password;
  }

  set SessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  genSessionId(): string {
    // return randomString
    return randomUUID().replace(/-/g, "");
  }

  genUsernameWithSessionId(): string {
    return `${this.username}-${this.sessionId}`;
  }

  toJSON(): string {
    return JSON.stringify({
      host: this.host ?? "",
      port: this.port ?? 0,
      username: this.username ?? "",
      password: this.password ?? "",
      sessionId: this.sessionId ?? "",
    });
  }
}

export class HasksiSession {
  private headers: HasksiHeaders = new HasksiHeaders({});
  private cookies: HasksiCookies = new HasksiCookies();
  // prettier-ignore
  private userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
  private sessionId: string | undefined;
  private csrfToken: string | undefined;
  private csrfHeader: string = "X-Csrf-Token";
  private csrfParam: string | undefined;

  get Headers(): HasksiHeaders {
    return this.headers;
  }

  get Cookies(): HasksiCookies {
    return this.cookies;
  }

  set SessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  get SessionId(): string | undefined {
    return this.sessionId;
  }

  set CsrfToken(csrfToken: string) {
    this.csrfToken = csrfToken;
  }

  get CsrfToken(): string | undefined {
    return this.csrfToken;
  }

  set CsrfHeader(csrfHeader: string) {
    this.csrfHeader = csrfHeader;
  }

  get UserAgent(): string {
    return this.userAgent;
  }

  set UserAgent(userAgent: string) {
    this.userAgent = userAgent;
  }

  get CsrfHeader(): string {
    return this.csrfHeader;
  }

  set CsrfParam(csrfParam: string) {
    this.csrfParam = csrfParam;
  }

  get CsrfParam(): string | undefined {
    return this.csrfParam;
  }

  handleResponse(response: HasksiResponse): void {
    this.cookies.processResponseCookies(response.cookie ?? []);

    const csrfToken = response.getCsrfToken();
    if (csrfToken) {
      this.CsrfToken = csrfToken;
    }
  }
}

interface HasksiOptions {
  //extends request.CoreOptions {
  method?: string;
  proxy?: string | null;
  followRedirect?: boolean;
  headers?: { [key: string]: string };
  data?: any;
}

interface HasksiResponse {
  status: number;
  statusText: string;
  headers: HasksiHeaders;
  cookie: string[] | undefined;
  ok: boolean;
  body: string;
  json: () => any;
  text: () => string;
  cheerio: () => CheerioAPI;
  getCsrfToken: () => string | undefined;
}

export class Hasksi {
  private session?: HasksiSession;

  constructor(session?: HasksiSession) {
    session && (this.session = session);
  }

  async get(url: string, options: HasksiOptions = {}): Promise<HasksiResponse> {
    return driver(url, { ...options, ...{ method: "GET" } }, this.session);
  }

  async post(url: string, options: HasksiOptions): Promise<HasksiResponse> {
    return driver(url, { ...options, ...{ method: "POST" } }, this.session);
  }
}

const driver = async (
  url: string,
  options: HasksiOptions,
  session?: HasksiSession
): Promise<HasksiResponse> => {
  const proxy = options?.proxy ?? null;
  if (session) {
    options.headers = options.headers ?? {};
    // prettier-ignore
    if (session.SessionId) options.headers["Session-Id"] = session.SessionId;
    // prettier-ignore
    if (!options?.headers?.["accept"]) options.headers["accept"] = "*/*";
    // prettier-ignore
    if (!options?.headers?.["user-agent"]) options.headers["user-agent"] = session.UserAgent;
    // prettier-ignore
    if (!options?.headers?.["accept-encoding"]) options.headers["accept-encoding"] = "gzip, deflate, br, zstd";
    // prettier-ignore
    if (!options?.headers?.["accept-language"]) options.headers["accept-language"] = "en-US,en;q=0.9,tr;q=0.8";
    // prettier-ignore
    if (!options?.headers?.["connection"]) options.headers["connection"] = "keep-alive";
    // prettier-ignore
    if (!options?.headers?.["cache-control"]) options.headers["cache-control"] = "no-cache";
    // prettier-ignore
    if (!options?.headers?.["host"]) options.headers["host"] = new URL(url).host;
    // prettier-ignore
    if (!options?.headers?.["pragma"]) options.headers["pragma"] = "no-cache";
    // prettier-ignore
    if(!options?.headers?.["cookie"]) options.headers["cookie"] = session.Cookies.readyCookies();

    if (
      options.headers["content-type"] === "application/x-www-form-urlencoded"
    ) {
      options.headers["content-length"] = options.data
        .toString()
        .length.toString();
    }

    if (session.CsrfToken)
      options.headers[session.CsrfHeader] = session.CsrfToken;
  }
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        method: options?.method ?? "GET",
        proxy,
        strictSSL: false,
        followRedirect: options?.followRedirect ?? false,
        headers: options?.headers || {},
        body: options?.data || null,
      },
      (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }

        let bRes = {
          status: response.statusCode,
          statusText: response.statusMessage,
          headers: new HasksiHeaders(response.headers as any),
          cookie: response.headers["set-cookie"],
          ok: response.statusCode >= 200 && response.statusCode < 300,
          body: body,
          json: () => JSON.parse(body ?? {}),
          text: () => body ?? "",
          cheerio: () => CheerioLoad(body ?? ""),
          getCsrfToken: () => {
            const $ = CheerioLoad(body ?? "");
            return $('meta[name="csrf-token"]').attr("content");
          },
        };
        session?.handleResponse(bRes);
        resolve(bRes);
      }
    );
  });
};
