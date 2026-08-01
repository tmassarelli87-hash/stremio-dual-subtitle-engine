import http from "http";
import { URL } from "url";
import { manifest } from "./manifest";
import { getSubtitles, SubtitleRequest } from "./subtitles";

const PORT = Number(process.env.PORT ?? 7000);

function sendJson(res: http.ServerResponse, payload: unknown, status = 200) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(body);
}

function sendText(res: http.ServerResponse, payload: string, status = 200) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(payload);
}

function buildBaseUrl(reqUrl: URL): string {
  return `http://${reqUrl.host}`;
}

const server = http.createServer((req, res) => {
  try {
    if (!req.url || !req.method) {
      sendText(res, "Bad Request", 400);
      return;
    }

    const requestUrl = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && requestUrl.pathname === "/manifest.json") {
      sendJson(res, manifest);
      return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/subtitles") {
      const subtitleRequest: SubtitleRequest = {
        type: requestUrl.searchParams.get("type") ?? undefined,
        imdb_id: requestUrl.searchParams.get("imdb_id") ?? undefined,
        tmdb_id: requestUrl.searchParams.get("tmdb_id") ?? undefined,
      };

      const subtitles = getSubtitles(subtitleRequest, buildBaseUrl(requestUrl));
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
  } catch (error) {
    sendJson(res, { error: "Internal Server Error" }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`Stremio subtitle addon running at http://localhost:${PORT}`);
});
