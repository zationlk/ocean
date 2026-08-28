-- Seed Categories, Sample Products, Testimonials, and Brands into ocean_lighting database
USE ocean_lighting;

-- 1. Insert Categories
INSERT INTO categories (name, slug, main_category, description, icon, image, product_count) VALUES
('Indoor Lighting', 'indoor-lighting', 'lighting', 'Premium indoor LED chandeliers, pendant lights, and ambient fixtures.', '🏮', '/images/categories/indoor.jpg', 1),
('Outdoor Lighting', 'outdoor-lighting', 'lighting', 'Weatherproof LED floodlights, bollards, garden lights, and wall sconces.', '🏡', '/images/categories/outdoor.jpg', 1),
('Commercial Lighting', 'commercial-lighting', 'lighting', 'High-efficiency office panel lights, track lights, and industrial high bays.', '🏬', '/images/categories/commercial.jpg', 1),
('LED Bulbs', 'led-bulbs', 'lighting', 'Energy saving LED bulbs, smart bulbs, filament bulbs, and decorative lamps.', '💡', '/images/categories/bulbs.jpg', 1),
('LED Tube Lights', 'led-tube-lights', 'lighting', 'T8 and T5 LED tube lights for linear illumination and ceiling troffers.', '💫', '/images/categories/tubes.jpg', 1),
('LED Ceiling Lights', 'led-ceiling-lights', 'lighting', 'Flush mount ceiling lights, recessed downlights, and decorative ceiling panels.', '🌟', '/images/categories/ceiling.jpg', 1),
('LED Strip Lighting', 'led-strip-lighting', 'lighting', 'Flexible COB and RGB LED strip lights for cove and accent lighting.', '🌈', '/images/categories/strips.jpg', 1),
('LED Mirror Lights', 'led-mirror-lights', 'lighting', 'Vanity mirror front lights, anti-fog illuminated LED mirrors, and wall bars.', '🪞', '/images/categories/mirror-lights.jpg', 1),
('LED Step Lights', 'led-step-lights', 'lighting', 'Recessed wall and staircase LED step lights for safe pathway lighting.', '🪜', '/images/categories/step-lights.jpg', 1),
('Electrical Items', 'electrical-items', 'lighting', 'Switches, sockets, MCB distribution boards, wire conduits, and accessories.', '🔌', '/images/categories/electrical.jpg', 1),

('Toilets (WC)', 'toilets-wc', 'bathware', 'Water closets, wall-hung toilets, rimless one-piece WC suites, and bidets.', '🚽', '/images/categories/toilets.jpg', 1),
('Wash Basins', 'wash-basins', 'bathware', 'Countertop ceramic basins, pedestal sinks, wall-hung basins, and art basins.', '🚿', '/images/categories/basins.jpg', 1),
('Faucets & Mixers', 'faucets-mixers', 'bathware', 'Brass basin mixers, wall-mounted taps, bath fillers, and thermostatic valves.', '🚰', '/images/categories/faucets.jpg', 1),
('Showers', 'showers', 'bathware', 'Rain shower heads, concealed shower mixers, hand shower sets, and massage columns.', '🛁', '/images/categories/showers.jpg', 1),
('Bathroom Accessories', 'bathroom-accessories', 'bathware', 'Towel bars, soap dispensers, glass shelves, robe hooks, and paper holders.', '🧴', '/images/categories/accessories.jpg', 1),
('Bathroom Mirrors', 'bathroom-mirrors', 'bathware', 'Smart touch LED mirrors, demister mirrors, framed vanity mirrors, and cabinets.', '🪟', '/images/categories/mirrors.jpg', 1),
('Vanity Units', 'vanity-units', 'bathware', 'Plywood and PVC waterproof bathroom vanity cabinets with ceramic basins.', '🗄️', '/images/categories/vanity.jpg', 1),
('Kitchen Sinks & Faucets', 'kitchen-sinks-faucets', 'bathware', 'Stainless steel double bowl sinks, pull-out kitchen spray faucets, and drains.', '🍳', '/images/categories/kitchen.jpg', 1),
('Plumbing Accessories', 'plumbing-accessories', 'bathware', 'Brass angle valves, bottle traps, pop-up waste couplings, and flex hoses.', '🔧', '/images/categories/plumbing.jpg', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), main_category = VALUES(main_category), description = VALUES(description), icon = VALUES(icon), updated_at = CURRENT_TIMESTAMP;

-- 2. Insert 1 Sample Product per Subcategory
INSERT INTO products (name, slug, category, subcategory, model_number, description, short_description, images, specifications, features, is_featured, is_new, badge) VALUES
('Luxury Modern LED Chandelier', 'luxury-modern-led-chandelier', 'lighting', 'indoor-lighting', 'OLS-CH-60W-001', 'Premium architectural LED chandelier designed for living rooms, dining spaces, and hotel lobbies.', 'Modern architectural LED chandelier with dimmable warm white illumination.', '[]', '{"Wattage":"60W","Color Temperature":"3000K Warm White","Material":"Brushed Brass & Acrylic","Warranty":"3 Years"}', '["Energy Efficient LED","Dimmable Driver Included","Adjustable Hanging Cable","Modern Minimalist Design"]', 1, 1, 'Best Seller'),

('Heavy Duty Outdoor LED Floodlight', 'heavy-duty-outdoor-led-floodlight', 'lighting', 'outdoor-lighting', 'OLS-FL-100W-002', 'IP66 waterproof die-cast aluminum LED floodlight for building facades, gardens, and security.', 'IP66 weatherproof outdoor LED floodlight with high lumen output.', '[]', '{"Wattage":"100W","IP Rating":"IP66 Waterproof","Lumen Output":"11,000 LM","Warranty":"2 Years"}', '["Die-cast Aluminum Body","Tempered Glass Lens","Surge Protection Built-in","Wide Beam Angle"]', 1, 0, 'Outdoor'),

('Commercial Recessed LED Panel Light 60x60', 'commercial-recessed-led-panel-light-60x60', 'lighting', 'commercial-lighting', 'OLS-PL-40W-003', 'Ultra-slim 600x600mm LED ceiling panel for modern offices, hospitals, and retail environments.', 'Slim 60x60cm LED office panel light providing flicker-free illumination.', '[]', '{"Size":"600x600mm","Wattage":"40W","Color Temperature":"6500K Cool Daylight","Flicker Free":"Yes"}', '["Flicker-free Constant Current Driver","Even Light Distribution","Low Glare UGR<19","50,000 Hours Lifespan"]', 0, 0, 'Commercial'),

('Premium E27 LED Bulb 12W', 'premium-e27-led-bulb-12w', 'lighting', 'led-bulbs', 'OLS-BB-12W-004', 'High efficacy E27 screw base LED bulb replacing 100W incandescent lamps.', 'Energy saving 12W E27 LED bulb with instant full brightness.', '[]', '{"Base":"E27 Screw","Wattage":"12W","Equivalent":"100W Incandescent","Voltage":"220-240V"}', '["Instant On Without Delay","85% Energy Saving","Over-voltage Protection","High Color Rendering index"]', 0, 1, 'Eco Friendly'),

('Industrial T8 LED Tube Light 4ft', 'industrial-t8-led-tube-light-4ft', 'lighting', 'led-tube-lights', 'OLS-TB-18W-005', 'Single-ended powered T8 LED glass tube replacing traditional fluorescent tubes.', 'High lumen 4ft T8 LED tube light for commercial and industrial fixtures.', '[]', '{"Length":"1200mm (4ft)","Wattage":"18W","Lumen Output":"2,100 LM","Tube Type":"T8 Glass"}', '["No Starter or Ballast Required","Shatterproof Safety Coating","High Efficiency 115 LM/W"]', 0, 0, ''),

('Ultra Slim Flush Mount LED Ceiling Light', 'ultra-slim-flush-mount-led-ceiling-light', 'lighting', 'led-ceiling-lights', 'OLS-CL-24W-006', 'Modern round surface mount ceiling light for bedrooms, hallways, and living areas.', 'Sleek round LED ceiling fixture with uniform edge-lit diffusion.', '[]', '{"Diameter":"300mm","Wattage":"24W","Color Temperature":"4000K Natural White"}', '["Dustproof Sealed Structure","Easy Twist-Lock Installation","Slim 25mm Profile"]', 1, 0, 'Popular'),

('COB High Density Flexible LED Strip Light 24V', 'cob-high-density-flexible-led-strip-light-24v', 'lighting', 'led-strip-lighting', 'OLS-ST-10W-007', 'Continuous dotless COB LED tape light for cove lighting, cabinets, and architectural accents.', 'Dot-free 24V COB LED strip light with uniform linear light output.', '[]', '{"Voltage":"24V DC","LEDs per Meter":"480 LEDs","PCB Width":"8mm","Wattage/m":"10W/m"}', '["No Spotting or Dark Areas","Cuttable Every 50mm","3M Adhesive Backing"]', 0, 1, 'New Arrival'),

('Modern LED Vanity Mirror Light Bar', 'modern-led-vanity-mirror-light-bar', 'lighting', 'led-mirror-lights', 'OLS-ML-14W-008', 'Wall mounted chrome finished LED light fixture for bathroom mirrors and dressing tables.', 'Contemporary IP44 bathroom mirror front LED light bar.', '[]', '{"Finish":"Polished Chrome","IP Rating":"IP44","Wattage":"14W","Length":"600mm"}', '["IP44 Splashproof Rating","Anti-glare Frosted Diffuser","Solid Stainless Steel Base"]', 0, 0, ''),

('Recessed Outdoor Staircase LED Step Light', 'recessed-outdoor-staircase-led-step-light', 'lighting', 'led-step-lights', 'OLS-SL-3W-009', 'Low profile recessed footlight for indoor and outdoor stair treads and perimeter walls.', 'Compact 3W recessed LED step light for safe walkway illumination.', '[]', '{"Wattage":"3W","IP Rating":"IP65 Waterproof","Cutout":"80x80mm","Material":"Aluminum"}', '["Glareshield Louver Plate","Embedded Backbox Included","Long Life CREE LED Chip"]', 0, 0, ''),

('Modular 2-Gang 1-Way Switch Panel', 'modular-2-gang-1-way-switch-panel', 'lighting', 'electrical-items', 'OLS-SW-16A-010', 'Sleek tempered glass plate electrical wall switch with indicator light.', 'Luxury 2-gang electrical switch panel with durable brass terminals.', '[]', '{"Rated Current":"16A","Voltage":"250V","Material":"Fire Retardant Polycarbonate","Warranty":"5 Years"}', '["Silver Alloy Contact Points","Child Safety Shutter","Sleek Modern Plate"]', 0, 0, ''),

('Tornado Rimless One-Piece Flushing WC Toilet', 'tornado-rimless-one-piece-flushing-wc-toilet', 'bathware', 'toilets-wc', 'OLS-WC-300S-011', 'Modern ceramic rimless WC suite with dual tornado flush technology and soft-close seat.', 'Luxury one-piece rimless ceramic toilet with water-saving dual flush.', '[]', '{"Rough-in":"300mm S-Trap","Flush Volume":"3.5L / 5L Dual Flush","Seat Cover":"UF Soft Close"}', '["Rimless Hygienic Bowl Design","Tornado Flush Technology","Nano Self-Cleaning Glaze","Soft Close Seat Included"]', 1, 1, 'Top Rated'),

('Countertop Luxury Ceramic Art Wash Basin', 'countertop-luxury-ceramic-art-wash-basin', 'bathware', 'wash-basins', 'OLS-BS-5038-012', 'Handcrafted oval vessel sink in matte white ceramic glaze for modern vanity countertops.', 'Elegant oval countertop vessel basin with scratch resistant ceramic finish.', '[]', '{"Dimensions":"500x380x140mm","Mounting":"Countertop Vessel","Color":"Matte White"}', '["High Temperature Vitrified Porcelain","Smooth Stain Resistant Glaze","Standard 45mm Waste Hole"]', 1, 0, 'Luxury'),

('Tall Monobloc Brass Basin Mixer Faucet', 'tall-monobloc-brass-basin-mixer-faucet', 'bathware', 'faucets-mixers', 'OLS-FM-BG-013', 'Contemporary single lever tall basin tap designed for countertop vessel sinks.', 'Solid brass tall basin mixer faucet in brushed gold finish.', '[]', '{"Material":"H59 Solid Brass","Finish":"Brushed Gold","Cartridge":"Sedal Ceramic Disk"}', '["Swiss Neoperl Honeycomb Aerator","High Quality Ceramic Disc Cartridge","Hot & Cold Flexible Hoses Included"]', 1, 0, 'Hot Selling'),

('Thermostatic Rain Shower Column System', 'thermostatic-rain-shower-column-system', 'bathware', 'showers', 'OLS-SH-250T-014', 'Luxury thermostatic shower column featuring 10-inch overhead rain shower and handheld sprayer.', 'Complete thermostatic shower column set with anti-scald temperature control.', '[]', '{"Head Size":"250x250mm (10 inch)","Thermostatic Lock":"38°C Safety Button","Valve Material":"Solid Brass"}', '["38°C Safety Anti-Scald Valve","Silicone Easy-Clean Nozzles","Adjustable Height Slide Bar"]', 1, 1, 'Premium'),

('5-Piece Stainless Steel Bathroom Accessory Set', '5-piece-stainless-steel-bathroom-accessory-set', 'bathware', 'bathroom-accessories', 'OLS-BA-5PC-015', 'Includes towel bar, toilet paper holder, robe hook, soap dish, and towel ring.', 'Complete 5-piece bathroom accessory set in matte black stainless steel.', '[]', '{"Material":"SUS304 Stainless Steel","Finish":"Matte Black","Installation":"Concealed Screw Mount"}', '["Rust & Corrosion Resistant SUS304","Concealed Mounting Hardware Included","Durable Electroplated Finish"]', 0, 0, ''),

('Smart Touch Screen LED Anti-Fog Bathroom Mirror', 'smart-touch-screen-led-anti-fog-bathroom-mirror', 'bathware', 'bathroom-mirrors', 'OLS-MR-8060-016', 'Frameless illuminated bathroom mirror with built-in demister pad and touch sensor button.', 'Smart LED bathroom mirror with integrated anti-fog heating pad.', '[]', '{"Dimensions":"800x600mm","Light Color":"Dimmable 3000K-6000K","Glass":"5mm Copper-Free Silver Mirror"}', '["Built-in Heating Demister Pad","Touch Control Dimmer Switch","Explosion-Proof Safety Membrane"]', 1, 0, 'Smart Tech'),

('Wall-Hung Waterproof Vanity Cabinet Unit', 'wall-hung-waterproof-vanity-cabinet-unit', 'bathware', 'vanity-units', 'OLS-VU-750P-017', '75cm floating vanity cabinet in dark walnut texture with integrated ceramic sink basin.', 'Floating waterproof PVC vanity unit with soft-closing drawers and ceramic sink.', '[]', '{"Cabinet Size":"750x460x500mm","Material":"100% Waterproof PVC","Basin":"Integrated Seamless Ceramic"}', '["100% Waterproof PVC Construction","DTC Soft Close Drawer Slides","Spacious Storage Compartment"]', 0, 1, 'New'),

('Handmade Stainless Steel Double Bowl Kitchen Sink', 'handmade-stainless-steel-double-bowl-kitchen-sink', 'bathware', 'kitchen-sinks-faucets', 'OLS-KS-8245-018', 'Heavy duty 1.2mm SUS304 handmade double bowl kitchen sink with sound dampening pads.', 'Undermount / Topmount SUS304 double bowl kitchen sink with drain strainer basket.', '[]', '{"Steel Gauge":"1.2mm Thickness (18 Gauge)","Overall Size":"820x450x220mm","Material":"Grade 304 Stainless Steel"}', '["Acoustic Sound Dampening Pads","Protective Undercoating Prevents Condensation","Includes Stainless Steel Waste Strainer"]', 0, 0, ''),

('Solid Brass Pop-Up Drain Waste Coupling', 'solid-brass-pop-up-drain-waste-coupling', 'bathware', 'plumbing-accessories', 'OLS-PW-125-019', 'Universal 1-1/4 inch pop up drain assembly with overflow slot for ceramic wash basins.', 'Heavy duty brass pop-up waste coupling with silicone sealing gaskets.', '[]', '{"Connection":"G 1-1/4 Standard","Material":"Solid Brass Body","Type":"With Overflow"}', '["Brass Spring Mechanism","Leak-free Silicone Gaskets","Tarnish Resistant Chrome Plating"]', 0, 0, '')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), model_number = VALUES(model_number), updated_at = CURRENT_TIMESTAMP;

-- 3. Insert Testimonials
INSERT INTO testimonials (name, role, company, content, rating, avatar) VALUES
('Dilshan Fernando', 'Architect', 'Studio Forma', 'Ocean Lighting Solutions provided outstanding architectural LED fixtures for our hotel project in Galle. High quality and excellent customer service!', 5, '/images/avatars/user1.jpg'),
('Nirosha Perera', 'Home Owner', 'Negombo', 'Bought all our bathroom sanitaryware and LED ceiling lights from Ocean Lighting. The team in Negombo showroom was super helpful and prices were very fair.', 5, '/images/avatars/user2.jpg'),
('Kasun Jayawardena', 'Interior Designer', 'Col 03', 'Their LED strip lights and thermostatic shower columns are top tier. I regularly recommend Ocean Lighting to my residential clients.', 5, '/images/avatars/user3.jpg')
ON DUPLICATE KEY UPDATE name = VALUES(name), content = VALUES(content), updated_at = CURRENT_TIMESTAMP;

-- 4. Insert Partner Brands
INSERT INTO brands (name, logo, website, sort_order) VALUES
('Philips LED', '/images/brands/philips.svg', 'https://www.philips.com', 1),
('Osram', '/images/brands/osram.svg', 'https://www.osram.com', 2),
('Schneider Electric', '/images/brands/schneider.svg', 'https://www.se.com', 3),
('Kohler Bathware', '/images/brands/kohler.svg', 'https://www.kohler.com', 4),
('Grohe', '/images/brands/grohe.svg', 'https://www.grohe.com', 5),
('TOTO', '/images/brands/toto.svg', 'https://www.toto.com', 6)
ON DUPLICATE KEY UPDATE name = VALUES(name), updated_at = CURRENT_TIMESTAMP;
