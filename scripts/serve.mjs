// Tiny static server for local development: npm start → http://localhost:5173
// Page paths (/d/kannur, /eat/sadya …) have no file, so they get index.html, just like the deployed site.
// npm run preview → serves the built dist/ folder instead (run npm run build first).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const HERE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const ROOT = process.argv[2] ? path.resolve(HERE, process.argv[2]) : HERE;
const PORT = process.env.PORT || 5173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json",
  ".md": "text/plain; charset=utf-8", ".ogg": "audio/ogg", ".mp3": "audio/mpeg", ".geojson": "application/json",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, url === "/" ? "index.html" : url);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      if (path.extname(url)) return res.writeHead(404).end("Not found");
      // A built page (dist/d/kannur/index.html) if there is one, otherwise the app shell.
      const page = path.join(ROOT, url, "index.html");
      file = fs.existsSync(page) ? page : path.join(ROOT, "index.html");
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Kerala Journey → http://localhost:${PORT}`));
