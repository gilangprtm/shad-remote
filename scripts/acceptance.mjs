import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { once } from "node:events";

const root = resolve(import.meta.dirname, "..");
const inertiaDist = join(root, "consumer-template", "inertia-consumer", "dist");
const tanstackDist = join(root, "consumer-template", "tanstack-consumer", "dist");

function mime(p) {
  const table = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
  return table[extname(p)] ?? "application/octet-stream";
}
async function serve(dir, port) {
  const srv = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const p = join(dir, url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, ""));
    try {
      res.writeHead(200, { "content-type": mime(p) });
      res.end(await readFile(p));
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  srv.listen(port, "127.0.0.1");
  await once(srv, "listening");
  return srv;
}
async function assetsContaining(dir, needle) {
  const files = (await readdir(join(dir, "assets"))).filter((f) => f.endsWith(".js"));
  const hits = [];
  for (const f of files) {
    const text = await readFile(join(dir, "assets", f), "utf8");
    if (text.includes(needle)) hits.push(f);
  }
  return hits;
}

const remoteSrv = await serve(join(root, "deploy"), 4173);
const inertiaSrv = await serve(inertiaDist, 4174);
const tanstackSrv = await serve(tanstackDist, 4175);
try {
  for (const p of ["/v1/assets/remoteEntry.js", "/v1/mf-manifest.json"]) {
    const r = await fetch(`http://127.0.0.1:4173${p}`);
    if (!r.ok) throw new Error(`${p} -> ${r.status}`);
  }
  for (const [label, dist, port] of [["inertia", inertiaDist, 4174], ["tanstack", tanstackDist, 4175]]) {
    const html = await fetch(`http://127.0.0.1:${port}/`).then((r) => r.text());
    if (!html.includes("/assets/")) throw new Error(`${label} bundle missing`);
    const refs = await assetsContaining(dist, "4173/v1/assets/remoteEntry.js");
    if (!refs.length) throw new Error(`${label} does not reference remote entry`);
    const bundled = await assetsContaining(dist, "edjavu-button-primary");
    if (bundled.length) throw new Error(`${label} bundles remote implementation`);
  }
  console.log("LOCAL_RUNTIME_CHECKS_OK");
} finally {
  remoteSrv.close();
  inertiaSrv.close();
  tanstackSrv.close();
}
