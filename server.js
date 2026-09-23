// server.js - Production Entry Point for cPanel / Phusion Passenger
const http = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Explicitly set working directory to the app root so .next and public are always found
const appDir = __dirname;
try {
  process.chdir(appDir);
} catch (e) {
  console.warn('Could not chdir to', appDir, e);
}

// Passenger passes either a numeric port, a socket path, or 'passenger' in process.env.PORT
const port = process.env.PORT || 3000;
const dev = false;

console.log(`[Ocean Lighting] Initializing Next.js from ${appDir}...`);

const app = next({
  dev: false,
  dir: appDir,
  quiet: false,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('[Ocean Lighting] Request handling error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, (err) => {
    if (err) {
      console.error('[Ocean Lighting] Listen error:', err);
      process.exit(1);
    }
    console.log(`[Ocean Lighting] Production server listening on ${port}`);
  });
}).catch((err) => {
  console.error('[Ocean Lighting] Failed to prepare Next.js app:', err);
  process.exit(1);
});
