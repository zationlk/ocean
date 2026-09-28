// app.js — cPanel LiteSpeed / Phusion Passenger entry point for Ocean Lighting
const fs = require('fs');
const path = require('path');
const http = require('http');
const { parse } = require('url');

// Change working directory to this application root
process.chdir(__dirname);

// Logging helper that writes to both console and a startup log file
const LOG_FILE = path.join(__dirname, 'startup.log');
function log(msg) {
  const line = `[${new Date().toISOString()}] [Ocean Lighting] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch (e) {}
}

log('====================================================');
log('Starting Ocean Lighting server process...');
log(`Directory: ${__dirname}`);
log(`Node Version: ${process.version}`);
log(`PORT: ${process.env.PORT}`);

// ============================================================================
// 1. SELF-HEALING PERMISSIONS: Automatically fix Linux folder & file permissions
// ============================================================================
function fixPermissionsRecursively(targetDir) {
  try {
    if (!fs.existsSync(targetDir)) return;

    try {
      fs.chmodSync(targetDir, 0o755);
    } catch (e) {}

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(targetDir, entry.name);
      try {
        if (entry.isDirectory()) {
          fs.chmodSync(fullPath, 0o755);
          fixPermissionsRecursively(fullPath);
        } else {
          fs.chmodSync(fullPath, 0o644);
        }
      } catch (err) {
        // Continue even if an individual item throws
      }
    }
  } catch (err) {
    log(`Permission notice for ${targetDir}: ${err.message}`);
  }
}

try {
  log('Verifying permissions on .next and public folders...');
  fixPermissionsRecursively(path.join(__dirname, '.next'));
  fixPermissionsRecursively(path.join(__dirname, 'public'));
  log('Permissions verified (755/644).');
} catch (permErr) {
  log(`Permission error: ${permErr.message}`);
}

// ============================================================================
// 2. INITIALIZE NEXT.JS & ASYNCHRONOUS PREPARATION
// ============================================================================
let nextApp = null;
let handle = null;
let isReady = false;
let startupError = null;

try {
  const next = require('next');
  nextApp = next({ dev: false, dir: __dirname });
  handle = nextApp.getRequestHandler();
} catch (reqErr) {
  startupError = reqErr;
  log(`CRITICAL: Failed to require('next'): ${reqErr.stack || reqErr.message}`);
}

let preparePromise = null;
if (nextApp) {
  log('Preparing Next.js application in background...');
  preparePromise = nextApp.prepare()
    .then(() => {
      isReady = true;
      log('Next.js prepared successfully and is READY for requests!');
    })
    .catch((err) => {
      startupError = err;
      log(`CRITICAL: Next.js prepare() failed: ${err.stack || err.message}`);
      // NOTE: Do NOT call process.exit(1).
      // Keeping the process alive lets LiteSpeed connect and allows us to return
      // the diagnostic screen in HTTP 500 instead of LiteSpeed 503.
    });
}

// ============================================================================
// 3. HTTP SERVER (Listens IMMEDIATELY so LiteSpeed never encounters 503)
// ============================================================================
const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Scenario A: Startup or module loading failed
  if (startupError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Server Diagnostic</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #ef4444; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { color: #ef4444; margin-top: 0; font-size: 24px; }
    p { color: #cbd5e1; font-size: 15px; line-height: 1.6; }
    pre { background: #020617; color: #fca5a5; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5; border: 1px solid #334155; }
    .meta { margin-top: 25px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Application Startup Diagnostic</h1>
    <p>The Node.js server is successfully running under LiteSpeed, but Next.js encountered an issue during startup:</p>
    <pre>${startupError.stack || startupError.message || String(startupError)}</pre>
    <div class="meta">
      <p><strong>App Directory:</strong> ${__dirname}</p>
      <p><strong>Node.js Version:</strong> ${process.version}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  // Scenario B: Next.js is still preparing (wait for it up to 60s)
  if (!isReady && preparePromise) {
    try {
      await Promise.race([
        preparePromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Next.js startup timed out after 60 seconds.')), 60000))
      ]);
    } catch (waitErr) {
      if (!startupError) startupError = waitErr;
    }

    if (startupError) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Next.js Startup Error: ' + (startupError.stack || startupError.message));
      return;
    }
  }

  // Scenario C: Forward request to Next.js
  try {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  } catch (err) {
    log(`Request Error for ${req.url}: ${err.message}`);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
  }
});

// Listen immediately on process.env.PORT (or 3000)
server.listen(port, (err) => {
  if (err) {
    log(`FATAL: Server listen error on ${port}: ${err.message}`);
    process.exit(1);
  }
  log(`Server successfully listening on ${port}. LiteSpeed connection established!`);
});

// Process-level error safety to prevent unexpected exits
process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.stack || err.message}`);
});
process.on('unhandledRejection', (reason) => {
  log(`Unhandled Rejection: ${reason}`);
});
