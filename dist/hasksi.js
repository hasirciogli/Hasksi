var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from "request";
import { load as CheerioLoad } from "cheerio";
import { randomUUID } from "crypto";
/**
 * Hasksi
 */
export class HasksiHeaders {
    constructor(headers) {
        this.headers = headers;
    }
    // if key equals to "set-cookie", return type an array of cookies
    get(key) {
        key = key.toLowerCase();
        return this.headers[key];
    }
    set(key, value) {
        key = key.toLowerCase();
        this.headers[key] = value;
    }
    delete(key) {
        key = key.toLowerCase();
        delete this.headers[key];
    }
    clear() {
        this.headers = {};
    }
    has(key) {
        key = key.toLowerCase();
        return key in this.headers;
    }
    keys() {
        return Object.keys(this.headers);
    }
    values() {
        return Object.values(this.headers);
    }
    entries() {
        return Object.entries(this.headers);
    }
    each(callback) {
        Object.entries(this.headers).forEach(([key, value]) => callback(key, value));
    }
    toString() {
        return JSON.stringify(this.headers);
    }
    toJSON() {
        return this.headers;
    }
    [Symbol.iterator]() {
        return this.entries()[Symbol.iterator]();
    }
}
export class HasksiCookies {
    constructor() {
        // cookielerde path ve zaman gibi tüm herşey olmalı
        this.cookies = {};
    }
    get(key) {
        var _a;
        // decrypt cookie value if it is encrypted
        return decodeURIComponent((_a = this.cookies[key]) === null || _a === void 0 ? void 0 : _a.value);
    }
    set(key, value, options = {}) {
        value = encodeURIComponent(value);
        this.cookies[key] = Object.assign({ value }, options);
    }
    readyCookies() {
        return Object.entries(this.cookies)
            .map(([key, data]) => {
            return `${key}=${data.value}`;
        })
            .join("; ");
    }
    processResponseCookies(cookies) {
        cookies.forEach((cookie) => {
            const [key, value] = cookie.split(";")[0].split("=");
            this.cookies[key] = Object.assign({ value }, {});
        });
    }
}
export class HasksiProxy {
    constructor(host, port, username, password, sessionId) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.sessionId = sessionId;
    }
    get Host() {
        return this.host;
    }
    get Port() {
        return this.port;
    }
    get Username() {
        return this.username;
    }
    get Password() {
        return this.password;
    }
    get SessionId() {
        return this.sessionId;
    }
    set Host(host) {
        this.host = host;
    }
    set Port(port) {
        this.port = port;
    }
    set Username(username) {
        this.username = username;
    }
    set Password(password) {
        this.password = password;
    }
    set SessionId(sessionId) {
        this.sessionId = sessionId;
    }
    genSessionId() {
        // return randomString
        return randomUUID().replace(/-/g, "");
    }
    genUsernameWithSessionId() {
        return `${this.username}-${this.sessionId}`;
    }
    toJSON() {
        var _a, _b, _c, _d, _e;
        return JSON.stringify({
            host: (_a = this.host) !== null && _a !== void 0 ? _a : "",
            port: (_b = this.port) !== null && _b !== void 0 ? _b : 0,
            username: (_c = this.username) !== null && _c !== void 0 ? _c : "",
            password: (_d = this.password) !== null && _d !== void 0 ? _d : "",
            sessionId: (_e = this.sessionId) !== null && _e !== void 0 ? _e : "",
        });
    }
}
export class HasksiSession {
    constructor() {
        this.headers = new HasksiHeaders({});
        this.cookies = new HasksiCookies();
        // prettier-ignore
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
        this.csrfHeader = "X-Csrf-Token";
    }
    get Headers() {
        return this.headers;
    }
    get Cookies() {
        return this.cookies;
    }
    set SessionId(sessionId) {
        this.sessionId = sessionId;
    }
    get SessionId() {
        return this.sessionId;
    }
    set CsrfToken(csrfToken) {
        this.csrfToken = csrfToken;
    }
    get CsrfToken() {
        return this.csrfToken;
    }
    set CsrfHeader(csrfHeader) {
        this.csrfHeader = csrfHeader;
    }
    get UserAgent() {
        return this.userAgent;
    }
    set UserAgent(userAgent) {
        this.userAgent = userAgent;
    }
    get CsrfHeader() {
        return this.csrfHeader;
    }
    set CsrfParam(csrfParam) {
        this.csrfParam = csrfParam;
    }
    get CsrfParam() {
        return this.csrfParam;
    }
    handleResponse(response) {
        var _a;
        this.cookies.processResponseCookies((_a = response.cookie) !== null && _a !== void 0 ? _a : []);
        const csrfToken = response.getCsrfToken();
        if (csrfToken) {
            this.CsrfToken = csrfToken;
        }
    }
}
export class Hasksi {
    constructor(session) {
        session && (this.session = session);
    }
    get(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, options = {}) {
            return driver(url, Object.assign(Object.assign({}, options), { method: "GET" }), this.session);
        });
    }
    post(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return driver(url, Object.assign(Object.assign({}, options), { method: "POST" }), this.session);
        });
    }
}
const driver = (url, options, session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const proxy = (_a = options === null || options === void 0 ? void 0 : options.proxy) !== null && _a !== void 0 ? _a : null;
    if (session) {
        options.headers = (_b = options.headers) !== null && _b !== void 0 ? _b : {};
        // prettier-ignore
        if (session.SessionId)
            options.headers["Session-Id"] = session.SessionId;
        // prettier-ignore
        if (!((_c = options === null || options === void 0 ? void 0 : options.headers) === null || _c === void 0 ? void 0 : _c["accept"]))
            options.headers["accept"] = "*/*";
        // prettier-ignore
        if (!((_d = options === null || options === void 0 ? void 0 : options.headers) === null || _d === void 0 ? void 0 : _d["user-agent"]))
            options.headers["user-agent"] = session.UserAgent;
        // prettier-ignore
        if (!((_e = options === null || options === void 0 ? void 0 : options.headers) === null || _e === void 0 ? void 0 : _e["accept-encoding"]))
            options.headers["accept-encoding"] = "gzip, deflate, br, zstd";
        // prettier-ignore
        if (!((_f = options === null || options === void 0 ? void 0 : options.headers) === null || _f === void 0 ? void 0 : _f["accept-language"]))
            options.headers["accept-language"] = "en-US,en;q=0.9,tr;q=0.8";
        // prettier-ignore
        if (!((_g = options === null || options === void 0 ? void 0 : options.headers) === null || _g === void 0 ? void 0 : _g["connection"]))
            options.headers["connection"] = "keep-alive";
        // prettier-ignore
        if (!((_h = options === null || options === void 0 ? void 0 : options.headers) === null || _h === void 0 ? void 0 : _h["cache-control"]))
            options.headers["cache-control"] = "no-cache";
        // prettier-ignore
        if (!((_j = options === null || options === void 0 ? void 0 : options.headers) === null || _j === void 0 ? void 0 : _j["host"]))
            options.headers["host"] = new URL(url).host;
        // prettier-ignore
        if (!((_k = options === null || options === void 0 ? void 0 : options.headers) === null || _k === void 0 ? void 0 : _k["pragma"]))
            options.headers["pragma"] = "no-cache";
        // prettier-ignore
        if (!((_l = options === null || options === void 0 ? void 0 : options.headers) === null || _l === void 0 ? void 0 : _l["cookie"]))
            options.headers["cookie"] = session.Cookies.readyCookies();
        if (options.headers["content-type"] === "application/x-www-form-urlencoded") {
            options.headers["content-length"] = options.data
                .toString()
                .length.toString();
        }
        if (session.CsrfToken)
            options.headers[session.CsrfHeader] = session.CsrfToken;
    }
    return new Promise((resolve, reject) => {
        var _a, _b;
        request({
            url,
            method: (_a = options === null || options === void 0 ? void 0 : options.method) !== null && _a !== void 0 ? _a : "GET",
            proxy,
            strictSSL: false,
            followRedirect: (_b = options === null || options === void 0 ? void 0 : options.followRedirect) !== null && _b !== void 0 ? _b : false,
            headers: (options === null || options === void 0 ? void 0 : options.headers) || {},
            body: (options === null || options === void 0 ? void 0 : options.data) || null,
        }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            let bRes = {
                status: response.statusCode,
                statusText: response.statusMessage,
                headers: new HasksiHeaders(response.headers),
                cookie: response.headers["set-cookie"],
                ok: response.statusCode >= 200 && response.statusCode < 300,
                body: body,
                json: () => JSON.parse(body !== null && body !== void 0 ? body : {}),
                text: () => body !== null && body !== void 0 ? body : "",
                cheerio: () => CheerioLoad(body !== null && body !== void 0 ? body : ""),
                getCsrfToken: () => {
                    const $ = CheerioLoad(body !== null && body !== void 0 ? body : "");
                    return $('meta[name="csrf-token"]').attr("content");
                },
            };
            session === null || session === void 0 ? void 0 : session.handleResponse(bRes);
            resolve(bRes);
        });
    });
});
