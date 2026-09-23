// app.js — cPanel LiteSpeed / Phusion Passenger entry point for Ocean Lighting
const fs = require('fs');
const path = require('path');
const http = require('http');
const { parse } = require('url');

// Change working directory to this application root
process.chdir(__dirname);

console.log('[Ocean Lighting] ==============================================');
console.log('[Ocean Lighting] Initializing Ocean Lighting server...');
console.log('[Ocean Lighting] Directory:', __dirname);
console.log('[Ocean Lighting] Node version:', process.version);
console.log('[Ocean Lighting] PORT:', process.env.PORT);

// ============================================================================
// 1. SELF-HEALING PERMISSIONS: Automatically fix Linux folder & file permissions
//    This fixes the "EACCES: permission denied, scandir .next/static/..." crash
//    by recursively granting 755 to directories and 644 to files before Next.js runs.
// ============================================================================
function fixPermissionsRecursively(targetDir) {
  try {
    if (!fs.existsSync(targetDir)) return;

    // Ensure the folder itself has read + execute (0o755) so its contents can be traversed
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
    console.error(`[Ocean Lighting] Permission notice for ${targetDir}:`, err.message);
  }
}

try {
  console.log('[Ocean Lighting] Self-healing permissions on .next and public folders...');
  fixPermissionsRecursively(path.join(__dirname, '.next'));
  fixPermissionsRecursively(path.join(__dirname, 'public'));
  console.log('[Ocean Lighting] Permissions successfully verified and applied (755/644)!');
} catch (permErr) {
  console.error('[Ocean Lighting] Permission fix error:', permErr);
}

// ============================================================================
// 2. INITIALIZE NEXT.JS PRODUCTION SERVER
// ============================================================================
const next = require('next');
const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare()
  .then(() => {
    console.log('[Ocean Lighting] Next.js prepared successfully!');

    const server = http.createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('[Ocean Lighting] Request Error:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    // Listen on port/socket without restricting host (allows LiteSpeed / Passenger binding)
    server.listen(port, (err) => {
      if (err) {
        console.error('[Ocean Lighting] Server listen error:', err);
        process.exit(1);
      }
      console.log(`[Ocean Lighting] Ready and listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error('[Ocean Lighting] Failed to start Next.js:', err);
    process.exit(1);
  });
