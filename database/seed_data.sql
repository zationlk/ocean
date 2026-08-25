USE ocean_lighting;

INSERT INTO site_settings (`key`, `value`) VALUES
('companyName', 'Ocean Lighting Solutions'),
('tagline', 'Premium Lighting & Bathware for Modern Living'),
('address', '123 Marine Drive, Colombo 03, Sri Lanka'),
('email', 'info@oceanlighting.lk'),
('website', 'https://www.oceanlighting.lk'),
('telephone', '+94 11 2 345 678'),
('mobile', '+94 77 123 4567'),
('whatsapp', '+94771234567'),
('businessHours', '{"weekdays":"9:00 AM - 6:00 PM","saturday":"9:00 AM - 1:00 PM","sunday":"Closed"}'),
('socialMedia', '{"facebook":"https://facebook.com/oceanlighting","instagram":"https://instagram.com/oceanlighting","youtube":"https://youtube.com/@oceanlighting"}'),
('heroTitle', 'Illuminate Your Space with Elegance'),
('heroSubtitle', 'Discover premium lighting fixtures and luxurious bathware designed for modern living'),
('aboutText', 'Ocean Lighting Solutions is a leading provider of premium lighting fixtures and luxurious bathware in Sri Lanka. With over a decade of experience, we bring you the finest products from renowned international brands, backed by expert design consultation and professional installation services.'),
('metaDescription', 'Ocean Lighting Solutions - Premium lighting fixtures and luxurious bathware for residential, commercial, and hospitality projects in Sri Lanka.');

INSERT INTO categories (name, slug, description, icon, image, product_count) VALUES
('Lighting', 'lighting', 'Premium lighting solutions including LED fixtures, chandeliers, and decorative lights', 'fa-lightbulb', 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80', 0),
('Bathware', 'bathware', 'Luxurious bathroom fixtures including showers, bathtubs, and sanitaryware', 'fa-bath', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80', 0),
('Outdoor', 'outdoor', 'Durable outdoor lighting and landscape solutions for gardens and exteriors', 'fa-tree', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', 0),
('Commercial', 'commercial', 'Professional lighting and bathware solutions for offices, hotels, and retail spaces', 'fa-building', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', 0);
