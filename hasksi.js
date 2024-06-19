const request = require("request");

class Headers {
    constructor(headers) {
        this.headers = headers;
    }

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

    string() {
        return JSON.stringify(this.headers);
    }

    toJSON() {
        return this.headers;
    }

    json() {
        return this.headers;
    }

    [Symbol.iterator]() {
        return this.entries();
    }
}

const Hasksi = async (url, options) => {
    var proxy = options?.proxy ?? null;

    typeof options?.data == URLSearchParams ? options.data = options.data.toString() : options.data = options.data;


    return new Promise((resolve, reject) => {
        request({
            url,
            method: options?.method ?? "GET",
            proxy,
            followRedirect: (options?.redirect ?? "") == "follow" ? true : false,
            headers: options?.headers || {},
            body: options?.data || null
        }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            resolve({
                status: response.statusCode,
                statusText: response.statusMessage,
                headers: new Headers(response.headers),
                ok: response.statusCode >= 200 && response.statusCode < 300,
                body: body,
                json: () => JSON.parse(body ?? {}),
                text: () => body ?? "",
                cheerio: () => import("cheerio").load(body ?? "")
            });
        });
    });
}

module.exports = Hasksi;