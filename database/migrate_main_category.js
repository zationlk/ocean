const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*?)\s*$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  });
}
const mysql = require('mysql2/promise');

async function runMigration() {
  console.log('🚀 Starting migration: Add main_category column + seed values for all categories');

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'ocean_lighting',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established');

    try {
      await connection.beginTransaction();

      console.log('\n📋 Step 1: Adding main_category column to categories table (if not exists)');
      const [columnCheck] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'main_category'`,
        [process.env.MYSQL_DATABASE || 'ocean_lighting']
      );

      if (columnCheck.length === 0) {
        await connection.query(
          `ALTER TABLE categories
           ADD COLUMN main_category VARCHAR(100) DEFAULT 'lighting' AFTER slug,
           ADD INDEX idx_main_category (main_category)`
        );
        console.log('   ✅ main_category column added successfully');
      } else {
        console.log('   ℹ️  main_category column already exists, skipping');
      }

      console.log('\n📋 Step 2: Seeding main_category values for all 19 categories');
      const assignments = [
        { slug: 'indoor-lighting',          main: 'lighting' },
        { slug: 'outdoor-lighting',         main: 'lighting' },
        { slug: 'commercial-lighting',      main: 'lighting' },
        { slug: 'led-bulbs',                main: 'lighting' },
        { slug: 'led-tube-lights',          main: 'lighting' },
        { slug: 'led-ceiling-lights',       main: 'lighting' },
        { slug: 'led-strip-lighting',       main: 'lighting' },
        { slug: 'led-mirror-lights',        main: 'lighting' },
        { slug: 'led-step-lights',          main: 'lighting' },
        { slug: 'electrical-items',         main: 'lighting' },
        { slug: 'toilets-wc',               main: 'bathware' },
        { slug: 'wash-basins',              main: 'bathware' },
        { slug: 'faucets-mixers',           main: 'bathware' },
        { slug: 'showers',                  main: 'bathware' },
        { slug: 'bathroom-accessories',     main: 'bathware' },
        { slug: 'bathroom-mirrors',         main: 'bathware' },
        { slug: 'vanity-units',             main: 'bathware' },
        { slug: 'kitchen-sinks-faucets',    main: 'bathware' },
        { slug: 'plumbing-accessories',     main: 'bathware' },
      ];

      let updated = 0;
      for (const a of assignments) {
        const [result] = await connection.query(
          `UPDATE categories SET main_category = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`,
          [a.main, a.slug]
        );
        if (result.affectedRows > 0) updated++;
      }
      console.log(`   ✅ Updated ${updated}/${assignments.length} categories with main_category`);

      await connection.commit();
      console.log('\n🎉 Migration completed successfully!');

      console.log('\n🔍 Verifying results...');
      const [rows] = await connection.query(
        `SELECT slug, main_category, icon FROM categories ORDER BY main_category ASC, id ASC`
      );
      console.log('\n📊 Category assignments:');
      rows.forEach((r) => {
        const marker = r.main_category === 'lighting' ? '💡' : '🚿';
        console.log(`   ${marker} [${r.main_category}] ${r.icon}  ${r.slug}`);
      });

    } catch (err) {
      await connection.rollback();
      console.error('❌ Migration failed, rolling back:', err);
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }

  await pool.end();
  process.exit(0);
}

runMigration();
