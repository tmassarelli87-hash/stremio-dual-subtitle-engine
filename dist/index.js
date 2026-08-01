"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const manifest_1 = require("./manifest");
const subtitles_1 = require("./subtitles");
const PORT = Number(process.env.PORT ?? 7000);
function sendJson(res, payload, status = 200) {
    const body = JSON.stringify(payload);
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
    });
    res.end(body);
}
function sendText(res, payload, status = 200) {
    res.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
    });
    res.end(payload);
}
function buildBaseUrl(reqUrl) {
    return `http://${reqUrl.host}`;
}
const server = http_1.default.createServer((req, res) => {
    try {
        if (!req.url || !req.method) {
            sendText(res, "Bad Request", 400);
            return;
        }
        const requestUrl = new url_1.URL(req.url, `http://${req.headers.host ?? "localhost"}`);
        if (req.method === "GET" && requestUrl.pathname === "/manifest.json") {
            sendJson(res, manifest_1.manifest);
            return;
        }
        if (req.method === "GET" && requestUrl.pathname === "/subtitles") {
            const subtitleRequest = {
                type: requestUrl.searchParams.get("type") ?? undefined,
                imdb_id: requestUrl.searchParams.get("imdb_id") ?? undefined,
                tmdb_id: requestUrl.searchParams.get("tmdb_id") ?? undefined,
            };
            const subtitles = (0, subtitles_1.getSubtitles)(subtitleRequest, buildBaseUrl(requestUrl));
            sendJson(res, { subtitles });
            return;
        }
        if (req.method === "GET" && requestUrl.pathname === "/subtitle-file.srt") {
            const sampleSrt = `1
00:00:00,000 --> 00:00:02,000
Hello from the minimal Stremio subtitle addon.\n`;
            res.writeHead(200, {
                "Content-Type": "application/x-subrip; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            });
            res.end(sampleSrt);
            return;
        }
        sendText(res, "Not Found", 404);
    }
    catch (error) {
        sendJson(res, { error: "Internal Server Error" }, 500);
    }
});
server.listen(PORT, () => {
    console.log(`Stremio subtitle addon running at http://localhost:${PORT}`);
});
