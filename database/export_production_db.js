const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dumpExe = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
const outputFile = path.join(__dirname, 'full_production_backup.sql');

console.log('Exporting MySQL database using mysqldump...');
const stdout = execSync(
  `"${dumpExe}" -u root --default-character-set=utf8mb4 --no-create-db --skip-comments ocean_lighting`,
  { maxBuffer: 50 * 1024 * 1024 }
);

const header = `-- Ocean Lighting Database Dump for Production
-- Compatible with cPanel / phpMyAdmin / MariaDB / MySQL
-- Pure UTF-8 without BOM

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

`;

const footer = `

SET FOREIGN_KEY_CHECKS = 1;
-- End of dump
`;

const finalSql = header + stdout.toString('utf8') + footer;
fs.writeFileSync(outputFile, finalSql, { encoding: 'utf8' });

const stats = fs.statSync(outputFile);
console.log(`Success! Written ${stats.size} bytes to ${outputFile}`);

// Verify content
const sample = fs.readFileSync(outputFile, 'utf8');
const tables = sample.match(/CREATE TABLE `[^`]+`/g) || [];
const inserts = sample.match(/INSERT INTO `[^`]+`/g) || [];
console.log('Tables found:', tables.length, tables);
console.log('Inserts found:', inserts.length);
