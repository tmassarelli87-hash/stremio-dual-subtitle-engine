import fs from "fs";
import http from "http";
import path from "path";
import { URL } from "url";

import { manifest } from "./manifest";
import { getSubtitles, SubtitleRequest } from "./subtitles";

const PORT = Number(process.env.PORT ?? 7000);

const subtitleFilePath = path.join(
  __dirname,
  "..",
  "test-subtitle.srt"
);

function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
}

function sendJson(
  res: http.ServerResponse,
  payload: unknown,
  status = 200
) {
  const body = JSON.stringify(payload, null, 2);

  setCorsHeaders(res);

  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });

  res.end(body);
}

function sendText(
  res: http.ServerResponse,
  payload: string,
  status = 200
) {
  setCorsHeaders(res);

  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  res.end(payload);
}

function buildBaseUrl(req: http.IncomingMessage): string {
  const host = req.headers.host;

  if (!host) {
    return `http://localhost:${PORT}`;
  }

  const protocol = "http";

  return `${protocol}://${host}`;
}


const server = http.createServer(
  (req, res) => {

    try {

      if (!req.url || !req.method) {
        sendText(res, "Bad Request", 400);
        return;
      }


      // Gestione preflight CORS
      if (req.method === "OPTIONS") {
        setCorsHeaders(res);
        res.writeHead(204);
        res.end();
        return;
      }


      const requestUrl = new URL(
        req.url,
        `http://${req.headers.host ?? "localhost"}`
      );


      console.log(
        `${req.method} ${requestUrl.pathname}`
      );


      /*
        Manifest Stremio
      */
      if (
        req.method === "GET" &&
        requestUrl.pathname === "/manifest.json"
      ) {

        sendJson(
          res,
          manifest
        );

        return;
      }



      /*
        Subtitle endpoint
      */
      if (
        req.method === "GET" &&
        requestUrl.pathname === "/subtitles"
      ) {

        const subtitleRequest: SubtitleRequest = {

          type:
            requestUrl.searchParams.get("type")
            ?? undefined,

          imdb_id:
            requestUrl.searchParams.get("imdb_id")
            ?? undefined,

          tmdb_id:
            requestUrl.searchParams.get("tmdb_id")
            ?? undefined,
        };


        const subtitles = getSubtitles(
          subtitleRequest,
          buildBaseUrl(req)
        );


        sendJson(
          res,
          {
            subtitles
          }
        );


        return;
      }




      /*
        Static subtitle file
      */
      if (
        req.method === "GET" &&
        requestUrl.pathname === "/subtitle-file.srt"
      ) {

        if (!fs.existsSync(subtitleFilePath)) {

          sendText(
            res,
            "Subtitle file not found",
            404
          );

          return;
        }


        const subtitleData =
          fs.readFileSync(
            subtitleFilePath,
            "utf-8"
          );


        setCorsHeaders(res);

        res.writeHead(200, {

          "Content-Type":
            "application/x-subrip; charset=utf-8",

          "Content-Disposition":
            "inline",

        });


        res.end(subtitleData);

        return;
      }




      sendText(
        res,
        "Not Found",
        404
      );


    } catch(error) {

      console.error(error);

      sendJson(
        res,
        {
          error:
            "Internal Server Error"
        },
        500
      );
    }

  }
);



/*
  IMPORTANTE:
  0.0.0.0 permette accesso dalla rete LAN
*/
server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Stremio subtitle addon running`
    );

    console.log(
      `Local: http://localhost:${PORT}/manifest.json`
    );

    console.log(
      `LAN: http://<YOUR_IP>:${PORT}/manifest.json`
    );

  }
);