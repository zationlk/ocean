-- Migration: Add model_number column, update category icons, and seed sample model numbers
-- Date: 2026-08-28
USE ocean_lighting;

-- 1. Add model_number column to products table if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'products';
SET @columnname = 'model_number';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(255) AFTER subcategory, ADD INDEX idx_model_number (', @columnname, ')')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Update category icons
UPDATE categories SET icon = '🏮', updated_at = CURRENT_TIMESTAMP WHERE slug = 'indoor-lighting';
UPDATE categories SET icon = '🏡', updated_at = CURRENT_TIMESTAMP WHERE slug = 'outdoor-lighting';
UPDATE categories SET icon = '🏬', updated_at = CURRENT_TIMESTAMP WHERE slug = 'commercial-lighting';
UPDATE categories SET icon = '💡', updated_at = CURRENT_TIMESTAMP WHERE slug = 'led-bulbs';
UPDATE categories SET icon = '💫', updated_at = CURRENT_TIMESTAMP WHERE slug = 'led-tube-lights';
UPDATE categories SET icon = '🌟', updated_at = CURRENT_TIMESTAMP WHERE slug = 'led-ceiling-lights';
UPDATE categories SET icon = '🌈', updated_at = CURRENT_TIMESTAMP WHERE slug = 'led-strip-lighting';
UPDATE categories SET icon = '🪞', updated_at = CURRENT_TIMESTAMP WHERE slug = 'led-mirror-lights';
UPDATE categories SET icon = '🪜', updated_at = CURRENT_TIMESTAMP WHERE slug = 'led-step-lights';
UPDATE categories SET icon = '🔌', updated_at = CURRENT_TIMESTAMP WHERE slug = 'electrical-items';

UPDATE categories SET icon = '🚽', updated_at = CURRENT_TIMESTAMP WHERE slug = 'toilets-wc';
UPDATE categories SET icon = '🚿', updated_at = CURRENT_TIMESTAMP WHERE slug = 'wash-basins';
UPDATE categories SET icon = '🚰', updated_at = CURRENT_TIMESTAMP WHERE slug = 'faucets-mixers';
UPDATE categories SET icon = '🛁', updated_at = CURRENT_TIMESTAMP WHERE slug = 'showers';
UPDATE categories SET icon = '🧴', updated_at = CURRENT_TIMESTAMP WHERE slug = 'bathroom-accessories';
UPDATE categories SET icon = '🪟', updated_at = CURRENT_TIMESTAMP WHERE slug = 'bathroom-mirrors';
UPDATE categories SET icon = '🗄️', updated_at = CURRENT_TIMESTAMP WHERE slug = 'vanity-units';
UPDATE categories SET icon = '🍳', updated_at = CURRENT_TIMESTAMP WHERE slug = 'kitchen-sinks-faucets';
UPDATE categories SET icon = '🔧', updated_at = CURRENT_TIMESTAMP WHERE slug = 'plumbing-accessories';

-- 3. Update product model numbers
UPDATE products SET model_number = 'OLS-CH-60W-001', updated_at = CURRENT_TIMESTAMP WHERE slug = 'luxury-modern-led-chandelier';
UPDATE products SET model_number = 'OLS-FL-100W-002', updated_at = CURRENT_TIMESTAMP WHERE slug = 'heavy-duty-outdoor-led-floodlight';
UPDATE products SET model_number = 'OLS-PL-40W-003', updated_at = CURRENT_TIMESTAMP WHERE slug = 'commercial-recessed-led-panel-light-60x60';
UPDATE products SET model_number = 'OLS-BB-12W-004', updated_at = CURRENT_TIMESTAMP WHERE slug = 'premium-e27-led-bulb-12w';
UPDATE products SET model_number = 'OLS-TB-18W-005', updated_at = CURRENT_TIMESTAMP WHERE slug = 'industrial-t8-led-tube-light-4ft';
UPDATE products SET model_number = 'OLS-CL-24W-006', updated_at = CURRENT_TIMESTAMP WHERE slug = 'ultra-slim-flush-mount-led-ceiling-light';
UPDATE products SET model_number = 'OLS-ST-10W-007', updated_at = CURRENT_TIMESTAMP WHERE slug = 'cob-high-density-flexible-led-strip-light-24v';
UPDATE products SET model_number = 'OLS-ML-14W-008', updated_at = CURRENT_TIMESTAMP WHERE slug = 'modern-led-vanity-mirror-light-bar';
UPDATE products SET model_number = 'OLS-SL-3W-009', updated_at = CURRENT_TIMESTAMP WHERE slug = 'recessed-outdoor-staircase-led-step-light';
UPDATE products SET model_number = 'OLS-SW-16A-010', updated_at = CURRENT_TIMESTAMP WHERE slug = 'modular-2-gang-1-way-switch-panel';
UPDATE products SET model_number = 'OLS-WC-300S-011', updated_at = CURRENT_TIMESTAMP WHERE slug = 'tornado-rimless-one-piece-flushing-wc-toilet';
UPDATE products SET model_number = 'OLS-BS-5038-012', updated_at = CURRENT_TIMESTAMP WHERE slug = 'countertop-luxury-ceramic-art-wash-basin';
UPDATE products SET model_number = 'OLS-FM-BG-013', updated_at = CURRENT_TIMESTAMP WHERE slug = 'tall-monobloc-brass-basin-mixer-faucet';
UPDATE products SET model_number = 'OLS-SH-250T-014', updated_at = CURRENT_TIMESTAMP WHERE slug = 'thermostatic-rain-shower-column-system';
UPDATE products SET model_number = 'OLS-BA-5PC-015', updated_at = CURRENT_TIMESTAMP WHERE slug = '5-piece-stainless-steel-bathroom-accessory-set';
UPDATE products SET model_number = 'OLS-MR-8060-016', updated_at = CURRENT_TIMESTAMP WHERE slug = 'smart-touch-screen-led-anti-fog-bathroom-mirror';
UPDATE products SET model_number = 'OLS-VU-750P-017', updated_at = CURRENT_TIMESTAMP WHERE slug = 'wall-hung-waterproof-vanity-cabinet-unit';
UPDATE products SET model_number = 'OLS-KS-8245-018', updated_at = CURRENT_TIMESTAMP WHERE slug = 'handmade-stainless-steel-double-bowl-kitchen-sink';
UPDATE products SET model_number = 'OLS-PW-125-019', updated_at = CURRENT_TIMESTAMP WHERE slug = 'solid-brass-pop-up-drain-waste-coupling';
