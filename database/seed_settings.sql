-- Seed default settings into site_settings table

INSERT INTO site_settings (`key`, `value`) VALUES
('companyName', '"Ocean Lighting Solutions"'),
('tagline', '"Premium Lighting & Bathware - Negombo, Sri Lanka"'),
('address', '"591, Chilaw Road, Kattuwa, Negombo, Sri Lanka"'),
('email', '"oceanlighting303@gmail.com"'),
('website', '"www.oceanlighting.lk"'),
('telephone', '"0314 300 657"'),
('mobile', '"077 9 900 657"'),
('whatsapp', '"94779900657"'),
('businessHours', '{"weekdays":"Monday - Friday: 8:00 AM - 6:00 PM","saturday":"Saturday: 8:00 AM - 4:00 PM","sunday":"Sunday: Closed"}'),
('socialMedia', '{"facebook":"https://facebook.com/oceanlighting","instagram":"https://instagram.com/oceanlighting","youtube":""}'),
('metaDescription', '"Ocean Lighting Solutions - Premium LED lighting, electrical items, and luxury bathware in Negombo, Sri Lanka. Visit our showroom at 591, Chilaw Road, Kattuwa."')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = CURRENT_TIMESTAMP;
