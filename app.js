// app.js — cPanel LiteSpeed / Phusion Passenger entry point for Ocean Lighting
const fs = require('fs');
const path = require('path');
const http = require('http');
const { parse } = require('url');
const { spawn } = require('child_process');

// Change working directory to this application root
process.chdir(__dirname);

// Load environment variables from .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of envLines) {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*?)\s*$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (e) {}
}

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
        startupError = null;
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
let isSyncing = false;

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);

  // --------------------------------------------------------------------------
  // Special Endpoint: /sync-build (Downloads and extracts .next from GitHub)
  // --------------------------------------------------------------------------
  if (parsedUrl.pathname === '/sync-build') {
    if (isSyncing) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Build sync is already in progress. Please wait...');
      return;
    }

    isSyncing = true;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Syncing Build</title>
  <style>
    body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 30px; line-height: 1.5; }
    h1 { color: #38bdf8; }
    pre { background: #020617; color: #a5f3fc; padding: 20px; border-radius: 8px; border: 1px solid #334155; max-height: 500px; overflow-y: auto; white-space: pre-wrap; }
    .success { color: #4ade80; font-weight: bold; font-size: 18px; margin-top: 20px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>🔄 Syncing .next Build from GitHub...</h1>
  <pre>`);

    const hasGit = fs.existsSync(path.join(__dirname, '.git'));
    let syncCmd;
    if (hasGit) {
      syncCmd = `git fetch origin main && git checkout origin/main -- .next`;
    } else {
      syncCmd = `curl -sL https://codeload.github.com/zationlk/ocean/tar.gz/refs/heads/main | tar -xzf - --strip-components=1 ocean-main/.next`;
    }

    log(`Running sync command: ${syncCmd}`);
    res.write(`Executing: ${syncCmd}\n\n`);

    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
    const shellArgs = process.platform === 'win32' ? ['/c', syncCmd] : ['-c', syncCmd];
    const child = spawn(shell, shellArgs, { cwd: __dirname });

    child.stdout.on('data', (d) => {
      res.write(d.toString());
      log(`[SYNC STDOUT] ${d.toString().trim()}`);
    });
    child.stderr.on('data', (d) => {
      res.write(d.toString());
      log(`[SYNC STDERR] ${d.toString().trim()}`);
    });

    child.on('close', (code) => {
      isSyncing = false;
      res.write('</pre>');
      try {
        fixPermissionsRecursively(path.join(__dirname, '.next'));
      } catch (e) {}

      const checkFile = path.join(__dirname, '.next', 'server', 'pages-manifest.json');
      if (fs.existsSync(checkFile)) {
        log('.next sync successful! Initializing Next.js...');
        initNext();
        res.write(`
          <div class="success">✅ .next production build synced successfully!</div>
          <p>pages-manifest.json is now verified and present. Next.js is initializing.</p>
          <a class="btn" href="/">🚀 Launch Ocean Lighting Website</a>
        </body></html>`);
      } else {
        log(`.next sync did not produce pages-manifest.json (exit code ${code})`);
        res.write(`
          <div style="color: #ef4444; font-size: 18px; margin-top: 20px;">⚠️ Automated download did not complete (Exit code ${code}).</div>
          <p>Please upload <strong>next-build.zip</strong> (2.2 MB from your local computer) into <code>/home/oceaymqu/ocean-lighting/</code> via cPanel File Manager and click <strong>Extract</strong>.</p>
          <a class="btn" href="/">Back to Status</a>
        </body></html>`);
      }
      res.end();
    });

    child.on('error', (err) => {
      isSyncing = false;
      log(`Sync spawn error: ${err.message}`);
      res.write(`Execution error: ${err.message}</pre></body></html>`);
      res.end();
    });
    return;
  }

  // --------------------------------------------------------------------------
  // Special Endpoint: /sync-db (1-click database importer for production)
  // --------------------------------------------------------------------------
  if (parsedUrl.pathname === '/sync-db') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Database Sync</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 30px; border: 1px solid #334155; }
    h1 { color: #38bdf8; margin-top: 0; }
    pre { background: #020617; color: #a5f3fc; padding: 20px; border-radius: 8px; border: 1px solid #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .success { color: #4ade80; font-weight: bold; font-size: 18px; margin-top: 20px; }
    .error { color: #f87171; font-weight: bold; font-size: 18px; margin-top: 20px; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: bold; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🗄️ Database Import & Sync</h1>
    <pre>`);

    try {
      res.write(`[1/4] Reading database credentials from .env...\n`);
      const dbHost = process.env.MYSQL_HOST || '127.0.0.1';
      const dbPort = parseInt(process.env.MYSQL_PORT || '3306');
      const dbUser = process.env.MYSQL_USER || 'root';
      const dbPass = process.env.MYSQL_PASSWORD || '';
      const dbName = process.env.MYSQL_DATABASE || 'ocean_lighting';

      res.write(`      Host: \${dbHost}:\${dbPort}\n`);
      res.write(`      User: \${dbUser}\n`);
      res.write(`      Database: \${dbName}\n\n`);

      res.write(`[2/4] Connecting to MySQL server...\n`);
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPass,
        database: dbName,
        multipleStatements: true
      });
      res.write(`      ✅ Connected successfully!\n\n`);

      res.write(`[3/4] Reading database/full_production_backup.sql...\n`);
      const sqlFile = path.join(__dirname, 'database', 'full_production_backup.sql');
      if (!fs.existsSync(sqlFile)) {
        throw new Error(`SQL file not found at: \${sqlFile}`);
      }
      const sqlContent = fs.readFileSync(sqlFile, 'utf8');
      res.write(`      File size: \${Math.round(sqlContent.length / 1024)} KB\n`);
      res.write(`      Executing database statements (tables + seeded data)...\n`);
      await conn.query(sqlContent);
      res.write(`      ✅ SQL executed successfully!\n\n`);

      res.write(`[4/4] Verifying imported tables and rows...\n`);
      const [brands] = await conn.query('SELECT COUNT(*) as count FROM brands');
      const [categories] = await conn.query('SELECT COUNT(*) as count FROM categories');
      const [products] = await conn.query('SELECT COUNT(*) as count FROM products');
      const [settings] = await conn.query('SELECT COUNT(*) as count FROM site_settings');
      const [testimonials] = await conn.query('SELECT COUNT(*) as count FROM testimonials');

      res.write(`      Brands:        \${brands[0].count}\n`);
      res.write(`      Categories:    \${categories[0].count}\n`);
      res.write(`      Products:      \${products[0].count}\n`);
      res.write(`      Site Settings: \${settings[0].count}\n`);
      res.write(`      Testimonials:  \${testimonials[0].count}\n`);

      await conn.end();

      res.write(`</pre>
      <div class="success">🎉 Database successfully imported and seeded!</div>
      <p style="color: #cbd5e1; margin-top: 10px;">All tables, categories, products, and site settings are now live in your production database.</p>
      <a class="btn" href="/admin/login">🔐 Go to Admin Login</a>
      <a class="btn" style="background: #059669; margin-left: 10px;" href="/">🏠 View Website Home</a>
    </div>
  </body>
</html>`);
      res.end();
    } catch (err) {
      res.write(`\n❌ Error: \${err.message}\n\${err.stack || ''}</pre>
      <div class="error">Database sync encountered an error.</div>
      <p style="color: #cbd5e1;">Please check your .env database credentials in cPanel File Manager.</p>
      <a class="btn" href="/">Return to Site</a>
    </div>
  </body>
</html>`);
      res.end();
    }
    return;
  }

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
  // Scenario A: Startup or module loading failed (e.g. Cannot find module 'next' or missing .next)
  // --------------------------------------------------------------------------
  if (startupError) {
    const errStr = String(startupError.stack || startupError.message || startupError);
    const isNextMissing = errStr.includes("Cannot find module 'next'");
    const isBuildMissing = errStr.includes("pages-manifest.json") || errStr.includes(".next");

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
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 10px 0; }
    .btn:hover { background: #1d4ed8; }
    .meta { margin-top: 25px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Application Startup Notice</h1>
    ${isBuildMissing ? `
      <div style="background: #1e3a8a; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #60a5fa; margin-top: 0;">📦 Production Build (.next folder) is Missing</h3>
        <p>The compiled production build files (<code>.next/server/pages-manifest.json</code>) are not present in <code>/home/oceaymqu/ocean-lighting/</code>.</p>
        <p>Choose either option below to resolve this:</p>
        <div style="margin: 15px 0;">
          <a class="btn" href="/sync-build">🚀 1-Click Sync .next Build from GitHub</a>
        </div>
        <p style="font-size: 13px; color: #93c5fd; margin-top: 10px;">
          <strong>Alternative:</strong> Upload <code>next-build.zip</code> (2.2 MB from your local project) into <code>/home/oceaymqu/ocean-lighting/</code> in cPanel File Manager and click <strong>Extract</strong>.
        </p>
      </div>
    ` : ''}
    ${isNextMissing ? `
      <div style="background: #1e3a8a; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #60a5fa; margin-top: 0;">📦 Production Dependencies Not Installed Yet</h3>
        <p>The <code>next</code> package is not yet installed on this server.</p>
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
