const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 3000);
const root = process.cwd();
const routes = [
  {
    prefix: '/event-audio/',
    dir: path.join(root, 'event-audio'),
  },
  {
    prefix: '/ui-audio/',
    dir: path.join(root, 'ui-audio'),
  },
  {
    prefix: '/assets/',
    dir: path.join(root, 'public/assets'),
  },
  {
    prefix: '/',
    dir: path.join(root, 'public'),
  },
];

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(filePath).pipe(res);
}

function resolveRoutePath(urlPath) {
  for (const route of routes) {
    if (!urlPath.startsWith(route.prefix)) {
      continue;
    }

    const relPath = decodeURIComponent(urlPath.slice(route.prefix.length));
    const safeRelPath = relPath || 'index.html';
    const candidate = path.normalize(path.join(route.dir, safeRelPath));

    if (!candidate.startsWith(route.dir)) {
      return null;
    }

    return candidate;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const urlPath = requestUrl.pathname;

  if (urlPath === '/' || urlPath === '/index.html') {
    return sendFile(path.join(root, 'public/index.html'), res);
  }

  const filePath = resolveRoutePath(urlPath);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    sendFile(filePath, res);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
