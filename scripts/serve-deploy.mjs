import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT || "3000");
const root = resolve(import.meta.dirname, "..", "deploy");
const host = "0.0.0.0";

const mime = (p) => ({ ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".svg": "image/svg+xml", ".map": "application/json" }[extname(p).toLowerCase()] ?? "application/octet-stream");

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  let file = normalize(join(root, url.pathname.replace(/^\//, "")));
  if (!file.startsWith(root)) { res.writeHead(403); res.end("forbidden"); return; }

  try {
    const st = statSync(file);
    if (st.isDirectory()) file = join(file, "index.html");
  } catch {
    if (!extname(url.pathname)) {
      const [channel] = url.pathname.replace(/^\//, "").split("/");
      file = join(root, channel || "v1", "index.html");
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  const stream = createReadStream(file);
  stream.on("open", () => {
    res.writeHead(200, { "content-type": mime(file), "cache-control": "no-store" });
    stream.pipe(res);
  });
  stream.on("error", () => {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found: " + url.pathname + "\n");
  });
});

server.listen(port, host, () => {
  console.log(`remote-ui deploy server listening on http://${host}:${port} serving ${root}`);
});
