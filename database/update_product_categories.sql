-- Update existing products to have correct category (Main Category: lighting or bathware) and subcategory

-- 1. Lighting Subcategories
UPDATE products
SET category = 'lighting',
    subcategory = IF(subcategory IS NULL OR subcategory = '' OR subcategory = 'lighting', slug, subcategory)
WHERE slug IN (
  'indoor-lighting', 'outdoor-lighting', 'commercial-lighting', 'led-bulbs',
  'led-tube-lights', 'led-ceiling-lights', 'led-strip-lighting',
  'led-mirror-lights', 'led-step-lights', 'electrical-items',
  'luxury-modern-led-chandelier', 'heavy-duty-outdoor-led-floodlight',
  'commercial-recessed-led-panel-light-60x60', 'premium-e27-led-bulb-12w',
  'industrial-t8-led-tube-light-4ft', 'ultra-slim-flush-mount-led-ceiling-light',
  'cob-high-density-flexible-led-strip-light-24v', 'modern-led-vanity-mirror-light-bar',
  'recessed-outdoor-staircase-led-step-light', 'modular-2-gang-1-way-switch-panel'
) OR category IN ('indoor-lighting', 'outdoor-lighting', 'commercial-lighting', 'led-bulbs', 'led-tube-lights', 'led-ceiling-lights', 'led-strip-lighting', 'led-mirror-lights', 'led-step-lights', 'electrical-items');

-- 2. Bathware Subcategories
UPDATE products
SET category = 'bathware',
    subcategory = IF(subcategory IS NULL OR subcategory = '' OR subcategory = 'bathware', slug, subcategory)
WHERE slug IN (
  'toilets-wc', 'wash-basins', 'faucets-mixers', 'showers',
  'bathroom-accessories', 'bathroom-mirrors', 'vanity-units',
  'kitchen-sinks-faucets', 'plumbing-accessories',
  'tornado-rimless-one-piece-flushing-wc-toilet', 'countertop-luxury-ceramic-art-wash-basin',
  'tall-monobloc-brass-basin-mixer-faucet', 'thermostatic-rain-shower-column-system',
  '5-piece-stainless-steel-bathroom-accessory-set', 'smart-touch-screen-led-anti-fog-bathroom-mirror',
  'wall-hung-waterproof-vanity-cabinet-unit', 'handmade-stainless-steel-double-bowl-kitchen-sink',
  'solid-brass-pop-up-drain-waste-coupling'
) OR category IN ('toilets-wc', 'wash-basins', 'faucets-mixers', 'showers', 'bathroom-accessories', 'bathroom-mirrors', 'vanity-units', 'kitchen-sinks-faucets', 'plumbing-accessories');

-- Ensure specific items have clean subcategory slugs
UPDATE products SET category = 'lighting', subcategory = 'indoor-lighting' WHERE slug = 'luxury-modern-led-chandelier';
UPDATE products SET category = 'lighting', subcategory = 'outdoor-lighting' WHERE slug = 'heavy-duty-outdoor-led-floodlight';
UPDATE products SET category = 'lighting', subcategory = 'commercial-lighting' WHERE slug = 'commercial-recessed-led-panel-light-60x60';
UPDATE products SET category = 'lighting', subcategory = 'led-bulbs' WHERE slug = 'premium-e27-led-bulb-12w';
UPDATE products SET category = 'lighting', subcategory = 'led-tube-lights' WHERE slug = 'industrial-t8-led-tube-light-4ft';
UPDATE products SET category = 'lighting', subcategory = 'led-ceiling-lights' WHERE slug = 'ultra-slim-flush-mount-led-ceiling-light';
UPDATE products SET category = 'lighting', subcategory = 'led-strip-lighting' WHERE slug = 'cob-high-density-flexible-led-strip-light-24v';
UPDATE products SET category = 'lighting', subcategory = 'led-mirror-lights' WHERE slug = 'modern-led-vanity-mirror-light-bar';
UPDATE products SET category = 'lighting', subcategory = 'led-step-lights' WHERE slug = 'recessed-outdoor-staircase-led-step-light';
UPDATE products SET category = 'lighting', subcategory = 'electrical-items' WHERE slug = 'modular-2-gang-1-way-switch-panel';

UPDATE products SET category = 'bathware', subcategory = 'toilets-wc' WHERE slug = 'tornado-rimless-one-piece-flushing-wc-toilet';
UPDATE products SET category = 'bathware', subcategory = 'wash-basins' WHERE slug = 'countertop-luxury-ceramic-art-wash-basin';
UPDATE products SET category = 'bathware', subcategory = 'faucets-mixers' WHERE slug = 'tall-monobloc-brass-basin-mixer-faucet';
UPDATE products SET category = 'bathware', subcategory = 'showers' WHERE slug = 'thermostatic-rain-shower-column-system';
UPDATE products SET category = 'bathware', subcategory = 'bathroom-accessories' WHERE slug = '5-piece-stainless-steel-bathroom-accessory-set';
UPDATE products SET category = 'bathware', subcategory = 'bathroom-mirrors' WHERE slug = 'smart-touch-screen-led-anti-fog-bathroom-mirror';
UPDATE products SET category = 'bathware', subcategory = 'vanity-units' WHERE slug = 'wall-hung-waterproof-vanity-cabinet-unit';
UPDATE products SET category = 'bathware', subcategory = 'kitchen-sinks-faucets' WHERE slug = 'handmade-stainless-steel-double-bowl-kitchen-sink';
UPDATE products SET category = 'bathware', subcategory = 'plumbing-accessories' WHERE slug = 'solid-brass-pop-up-drain-waste-coupling';
