-- Ocean Lighting Solutions - Initial Database Seed (EMPTY)
-- No sample data. All tables start empty.
-- Populate via Admin Dashboard after login.
-- Insert default site settings only (required for website to function)
INSERT INTO site_settings (`key`, `value`) VALUES
('companyName', 'Ocean Lighting Solutions'),
('tagline', 'Premium Lighting & Bathware'),
('address', ''),
('email', ''),
('website', ''),
('telephone', ''),
('mobile', ''),
('whatsapp', ''),
('businessHours', '{"weekdays":"","saturday":"","sunday":""}'),
('socialMedia', '{"facebook":"","instagram":"","youtube":""}'),
('heroTitle', 'Welcome'),
('heroSubtitle', ''),
('aboutText', ''),
('metaDescription', '')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
