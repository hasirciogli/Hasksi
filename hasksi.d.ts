// headers.d.ts

export class Headers {
  constructor(headers: { [key: string]: string });

  get(key: string): string | undefined;

  set(key: string, value: string): void;

  delete(key: string): void;

  clear(): void;

  has(key: string): boolean;

  keys(): string[];

  values(): string[];

  entries(): [string, string][];

  each(callback: (key: string, value: string) => void): void;

  toString(): string;

  string(): string;

  toJSON(): { [key: string]: string };

  json(): { [key: string]: string };

  [Symbol.iterator](): IterableIterator<[string, string]>;
}

export interface HasksiOptions {
  method?: string;
  proxy?: string | null;
  redirect?: string;
  headers?: { [key: string]: string };
  data?: any;
}

export interface HasksiResponse {
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
  body: any;
  json(): any;
  text(): string;
  cheerio(): Promise<any>;
}

export function Hasksi(
  url: string,
  options: HasksiOptions
): Promise<HasksiResponse>;
