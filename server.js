const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.gz':   'application/octet-stream',
  '.br':   'application/octet-stream',
};

http.createServer((req, res) => {
  // Strip query string before resolving the file path (?playerTest=1, etc.)
  const urlPath  = req.url.split('?')[0];
  const filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  const ext      = path.extname(filePath);
  const mime     = MIME[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type':  mime,
      'Content-Length': stat.size,
      // Required for SharedArrayBuffer (Unity 6 threading)
      'Cross-Origin-Opener-Policy':   'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => {
  console.log('Serving Bubble Man Rises at http://localhost:' + PORT);
  console.log('Self-test: http://localhost:' + PORT + '/?playerTest=1');
});
