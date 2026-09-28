// app.js — cPanel LiteSpeed / Phusion Passenger entry point for Ocean Lighting
const fs = require('fs');
const path = require('path');
const http = require('http');
const { parse } = require('url');
const { spawn } = require('child_process');

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
log(`Exec Path: ${process.execPath}`);
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
// 2. HELPER TO FIND NPM & INITIALIZE NEXT.JS
// ============================================================================
function findNpm() {
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeDir, 'npm'),
    path.join(nodeDir, 'npm.cmd'),
    '/usr/local/bin/npm',
    '/usr/bin/npm',
    'npm'
  ];
  for (const c of candidates) {
    if (c === 'npm' || fs.existsSync(c)) return c;
  }
  return 'npm';
}

let nextApp = null;
let handle = null;
let isReady = false;
let startupError = null;
let preparePromise = null;

function initNext() {
  try {
    const next = require('next');
    nextApp = next({ dev: false, dir: __dirname });
    handle = nextApp.getRequestHandler();
    startupError = null;
    log('Next.js module successfully loaded. Preparing application...');

    preparePromise = nextApp.prepare()
      .then(() => {
        isReady = true;
        log('Next.js prepared successfully and is READY for requests!');
      })
      .catch((err) => {
        startupError = err;
        log(`CRITICAL: Next.js prepare() failed: ${err.stack || err.message}`);
      });
  } catch (reqErr) {
    startupError = reqErr;
    log(`CRITICAL: Failed to require('next'): ${reqErr.stack || reqErr.message}`);
  }
}

initNext();

// ============================================================================
// 3. HTTP SERVER (Listens IMMEDIATELY so LiteSpeed never encounters 503)
// ============================================================================
const port = process.env.PORT || 3000;
let isInstalling = false;

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);

  // --------------------------------------------------------------------------
  // Special Endpoint: /install-deps (Allows 1-click install of node_modules directly from browser)
  // --------------------------------------------------------------------------
  if (parsedUrl.pathname === '/install-deps') {
    if (isInstalling) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Installation is already in progress. Please wait...');
      return;
    }

    isInstalling = true;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Installing Dependencies</title>
  <style>
    body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 30px; line-height: 1.5; }
    h1 { color: #38bdf8; }
    pre { background: #020617; color: #a5f3fc; padding: 20px; border-radius: 8px; border: 1px solid #334155; max-height: 500px; overflow-y: auto; white-space: pre-wrap; }
    .success { color: #4ade80; font-weight: bold; font-size: 18px; margin-top: 20px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>📦 Installing Ocean Lighting Dependencies...</h1>
  <p>Please keep this page open. Running <code>npm install --omit=dev --no-audit --no-fund</code>...</p>
  <pre>`);

    const npmCmd = findNpm();
    log(`Executing dependency install: ${npmCmd} install --omit=dev --no-audit --no-fund`);

    const child = spawn(npmCmd, ['install', '--omit=dev', '--no-audit', '--no-fund'], {
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PATH: `${path.dirname(process.execPath)}:${process.env.PATH || ''}`
      }
    });

    child.stdout.on('data', (data) => {
      res.write(data.toString());
      log(`[NPM STDOUT] ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
      res.write(data.toString());
      log(`[NPM STDERR] ${data.toString().trim()}`);
    });

    child.on('close', (code) => {
      isInstalling = false;
      res.write('</pre>');
      if (code === 0) {
        log('Dependencies successfully installed via /install-deps! Initializing Next.js...');
        initNext();
        res.write(`
          <div class="success">✅ All dependencies installed successfully!</div>
          <p>Next.js is now initializing in the background.</p>
          <a class="btn" href="/">🚀 Launch Ocean Lighting Website</a>
        </body></html>`);
      } else {
        log(`npm install exited with code ${code}`);
        res.write(`
          <div style="color: #ef4444; font-size: 18px; margin-top: 20px;">❌ NPM install failed with exit code ${code}</div>
          <p>Please check cPanel "Setup Node.js App" and click "Run NPM Install" manually.</p>
          <a class="btn" href="/">Back to Status</a>
        </body></html>`);
      }
      res.end();
    });

    child.on('error', (spawnErr) => {
      isInstalling = false;
      log(`Child process error: ${spawnErr.message}`);
      res.write(`\nChild process execution error: ${spawnErr.message}</pre></body></html>`);
      res.end();
    });
    return;
  }

  // --------------------------------------------------------------------------
  // Scenario A: Startup or module loading failed (e.g. Cannot find module 'next')
  // --------------------------------------------------------------------------
  if (startupError) {
    const isNextMissing = String(startupError.message || startupError).includes("Cannot find module 'next'");
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Server Status</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #ef4444; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { color: #ef4444; margin-top: 0; font-size: 24px; }
    p { color: #cbd5e1; font-size: 15px; line-height: 1.6; }
    pre { background: #020617; color: #fca5a5; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5; border: 1px solid #334155; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 15px 0; }
    .btn:hover { background: #1d4ed8; }
    .meta { margin-top: 25px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Application Startup Notice</h1>
    ${isNextMissing ? `
      <div style="background: #1e3a8a; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #60a5fa; margin-top: 0;">📦 Production Dependencies Not Installed Yet</h3>
        <p>The Node.js server is online and responding, but the <code>next</code> package is not yet installed on this server.</p>
        <p>Click the button below to automatically install all production packages:</p>
        <a class="btn" href="/install-deps">🚀 Click Here to Auto-Install Dependencies (1-Click)</a>
        <p style="font-size: 13px; color: #93c5fd;">Or in cPanel: Go to <strong>Setup Node.js App</strong> &rarr; click <strong>Run NPM Install</strong>.</p>
      </div>
    ` : ''}
    <p><strong>Technical Error Details:</strong></p>
    <pre>${startupError.stack || startupError.message || String(startupError)}</pre>
    <div class="meta">
      <p><strong>App Directory:</strong> ${__dirname}</p>
      <p><strong>Node.js Version:</strong> ${process.version}</p>
      <p><strong>Exec Path:</strong> ${process.execPath}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  // --------------------------------------------------------------------------
  // Scenario B: Next.js is still preparing (wait for it up to 60s)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Scenario C: Forward request to Next.js
  // --------------------------------------------------------------------------
  try {
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
