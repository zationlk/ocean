-- Ocean Lighting Solutions Database Schema
-- Run this SQL in your MySQL database to create the required tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ocean_lighting;
USE ocean_lighting;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  highlights JSON,
  tags JSON,
  year VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(500),
  image VARCHAR(500),
  product_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_product_count (product_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  images JSON,
  specifications JSON,
  features JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  badge VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_is_featured (is_featured),
  INDEX idx_is_new (is_new),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  `value` TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial project data
INSERT INTO projects (title, category, location, description, image, highlights, tags, year) VALUES
  (
    'Serenity Beach Resort – Full Lighting & Bathware Renovation',
    'Hospitality',
    'Negombo, Sri Lanka',
    'A complete lighting and sanitary overhaul of a 5-star beachfront resort. We imported, supplied, and installed 800+ LED fixtures and 140 luxury thermostatic rain shower columns, custom bidet suites, and facade illumination.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    '["800+ LED fixtures and 140 bath suites", "60% energy and water savings achieved", "Custom guest room brassware and crystal lighting", "Successful 5-star standard rating compliance"]',
    '["Commercial", "LED", "Rain Showers", "Bespoke Bathware"]',
    '2024'
  ),
  (
    'Luxe Corporate HQ – Intelligent Workspace',
    'Commercial',
    'Colombo, Sri Lanka',
    'Design and supply of a full LED panel lighting system and touchless smart sanitary restroom solutions for a 6-floor office complex. The project integrated motion downlights and anti-fog LED mirror cabinets.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    '["Full office recessed LED panel systems", "Touchless sensor sanitaryware installations", "CRI >90 for high accuracy color rendering", "Significant annual savings in electrical costs"]',
    '["Commercial", "LED Downlights", "Smart Toilet", "Restrooms"]',
    '2024'
  ),
  (
    'Mountain-View Villa – Luxury Home Suite',
    'Residential',
    'Kandy, Sri Lanka',
    'Bespoke interior lighting design and custom bathroom design for a luxury private villa. The project featured crystal chandeliers, freestanding acrylic bathtubs, brushed gold showers, and smart control setups.',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=900&q=80',
    '["Custom crystal chandelier and gold accents", "Lucite sanitary freestanding acrylic tub", "Brushed Gold thermostatic shower mixers", "Seamless app-controlled lighting scenes"]',
    '["Residential", "Interior Design", "Bathtubs", "Showers"]',
    '2023'
  ),
  (
    'Sakura Botanical Gardens – Landscape Lightscapes',
    'Outdoor',
    'Galle, Sri Lanka',
    'A comprehensive landscape lighting project for a private botanical garden. Deploying monocrystalline solar garden spikes, LED path lights, underwater pond illumination, and commercial flood lights.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    '["100% grid-free solar path installations", "IP66-rated robust weatherproof housings", "High-power LED spotlight highlighting trees", "Automated dusk-to-dawn sensor switches"]',
    '["Outdoor", "Solar Spikes", "Landscape Lights"]',
    '2023'
  );

-- Insert initial gallery data
INSERT INTO gallery_items (title, description, image, category) VALUES
  ('Crystal Chandelier Installation', 'Elegant crystal chandelier in a luxury hotel lobby', 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80', 'Commercial'),
  ('Modern Bathroom Lighting', 'LED vanity lighting with mirror cabinet', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', 'Residential'),
  ('Outdoor Pathway Lights', 'Solar-powered pathway lighting for gardens', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'Outdoor'),
  ('Commercial Office Lighting', 'Recessed LED panel lighting system', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'Commercial'),
  ('Luxury Bathware Display', 'Premium shower and bathtub installation', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Residential'),
  ('Industrial Warehouse Lighting', 'High-bay LED fixtures for warehouse', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', 'Industrial');
