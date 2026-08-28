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
  console.log('🚀 Starting migration: Add model_number column + seed category icons and model numbers');

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

      console.log('\n📋 Step 1: Adding model_number column to products table (if not exists)');
      const [columnCheck] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'model_number'`,
        [process.env.MYSQL_DATABASE || 'ocean_lighting']
      );

      if (columnCheck.length === 0) {
        await connection.query(
          `ALTER TABLE products ADD COLUMN model_number VARCHAR(255) NULL,
           ADD INDEX idx_model_number (model_number)`
        );
        console.log('   ✅ model_number column added successfully');
      } else {
        console.log('   ℹ️  model_number column already exists, skipping');
      }

      console.log('\n📋 Step 2: Seeding category icons (19 categories)');
      const categoryUpdates = [
        { slug: 'indoor-lighting', icon: '🏮' },
        { slug: 'outdoor-lighting', icon: '🏡' },
        { slug: 'commercial-lighting', icon: '🏬' },
        { slug: 'led-bulbs', icon: '💡' },
        { slug: 'led-tube-lights', icon: '💫' },
        { slug: 'led-ceiling-lights', icon: '🌟' },
        { slug: 'led-strip-lighting', icon: '🌈' },
        { slug: 'led-mirror-lights', icon: '🪞' },
        { slug: 'led-step-lights', icon: '🪜' },
        { slug: 'electrical-items', icon: '🔌' },
        { slug: 'toilets-wc', icon: '🚽' },
        { slug: 'wash-basins', icon: '🚿' },
        { slug: 'faucets-mixers', icon: '🚰' },
        { slug: 'showers', icon: '🛁' },
        { slug: 'bathroom-accessories', icon: '🧴' },
        { slug: 'bathroom-mirrors', icon: '🪟' },
        { slug: 'vanity-units', icon: '🗄️' },
        { slug: 'kitchen-sinks-faucets', icon: '🍳' },
        { slug: 'plumbing-accessories', icon: '🔧' },
      ];

      let catUpdated = 0;
      for (const cat of categoryUpdates) {
        const [result] = await connection.query(
          `UPDATE categories SET icon = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`,
          [cat.icon, cat.slug]
        );
        if (result.affectedRows > 0) catUpdated++;
      }
      console.log(`   ✅ Updated ${catUpdated}/${categoryUpdates.length} category icons`);

      console.log('\n📋 Step 3: Seeding product model numbers (19 products)');
      const productUpdates = [
        { slug: 'luxury-modern-led-chandelier', modelNumber: 'OLS-CH-60W-001' },
        { slug: 'heavy-duty-outdoor-led-floodlight', modelNumber: 'OLS-FL-100W-002' },
        { slug: 'commercial-recessed-led-panel-light-60x60', modelNumber: 'OLS-PL-40W-003' },
        { slug: 'premium-e27-led-bulb-12w', modelNumber: 'OLS-BB-12W-004' },
        { slug: 'industrial-t8-led-tube-light-4ft', modelNumber: 'OLS-TB-18W-005' },
        { slug: 'ultra-slim-flush-mount-led-ceiling-light', modelNumber: 'OLS-CL-24W-006' },
        { slug: 'cob-high-density-flexible-led-strip-light-24v', modelNumber: 'OLS-ST-10W-007' },
        { slug: 'modern-led-vanity-mirror-light-bar', modelNumber: 'OLS-ML-14W-008' },
        { slug: 'recessed-outdoor-staircase-led-step-light', modelNumber: 'OLS-SL-3W-009' },
        { slug: 'modular-2-gang-1-way-switch-panel', modelNumber: 'OLS-SW-16A-010' },
        { slug: 'tornado-rimless-one-piece-flushing-wc-toilet', modelNumber: 'OLS-WC-300S-011' },
        { slug: 'countertop-luxury-ceramic-art-wash-basin', modelNumber: 'OLS-BS-5038-012' },
        { slug: 'tall-monobloc-brass-basin-mixer-faucet', modelNumber: 'OLS-FM-BG-013' },
        { slug: 'thermostatic-rain-shower-column-system', modelNumber: 'OLS-SH-250T-014' },
        { slug: '5-piece-stainless-steel-bathroom-accessory-set', modelNumber: 'OLS-BA-5PC-015' },
        { slug: 'smart-touch-screen-led-anti-fog-bathroom-mirror', modelNumber: 'OLS-MR-8060-016' },
        { slug: 'wall-hung-waterproof-vanity-cabinet-unit', modelNumber: 'OLS-VU-750P-017' },
        { slug: 'handmade-stainless-steel-double-bowl-kitchen-sink', modelNumber: 'OLS-KS-8245-018' },
        { slug: 'solid-brass-pop-up-drain-waste-coupling', modelNumber: 'OLS-PW-125-019' },
      ];

      let prodUpdated = 0;
      for (const prod of productUpdates) {
        const [result] = await connection.query(
          `UPDATE products SET model_number = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`,
          [prod.modelNumber, prod.slug]
        );
        if (result.affectedRows > 0) prodUpdated++;
      }
      console.log(`   ✅ Updated ${prodUpdated}/${productUpdates.length} product model numbers`);

      await connection.commit();
      console.log('\n🎉 Migration completed successfully!');
      console.log('   - Category icons updated');
      console.log('   - Product model numbers updated');
      console.log('   - Database changes committed');

      console.log('\n🔍 Verifying results...');
      const [verifyCategories] = await connection.query(
        `SELECT slug, icon FROM categories ORDER BY id ASC`
      );
      console.log('\n📊 Category Icons:');
      verifyCategories.forEach((c) => {
        console.log(`   ${c.icon}  ${c.slug}`);
      });

      const [verifyProducts] = await connection.query(
        `SELECT slug, model_number FROM products ORDER BY id ASC`
      );
      console.log('\n📊 Product Model Numbers:');
      verifyProducts.forEach((p) => {
        console.log(`   [${p.model_number || 'N/A'}]  ${p.slug}`);
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
