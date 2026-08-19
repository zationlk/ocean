import { Product, Category, Testimonial, Brand, GalleryItem, SiteSettings } from "./types";

export const siteSettings: SiteSettings = {
  companyName: "Ocean Lighting Solutions",
  tagline: "Premium Lighting & Bathware — Negombo, Sri Lanka",
  address: "591, Chilaw Road, Kattuwa, Negombo, Sri Lanka",
  email: "oceanlighting303@gmail.com",
  website: "www.oceanlighting.lk",
  telephone: "0314 300 657",
  mobile: "077 9 900 657",
  whatsapp: "94779900657",
  businessHours: {
    weekdays: "Monday – Friday: 8:00 AM – 6:00 PM",
    saturday: "Saturday: 8:00 AM – 4:00 PM",
    sunday: "Sunday: Closed",
  },
  socialMedia: {
    facebook: "https://facebook.com/oceanlighting",
    instagram: "https://instagram.com/oceanlighting",
  },
  heroTitle: "Illuminate & Elevate Your Spaces",
  heroSubtitle: "Sri Lanka's trusted destination for premium LED lighting, electrical items, and luxury bathware. Serving homes, hotels, and commercial spaces from our showroom in Negombo.",
  aboutText: "Ocean Lighting Solutions is Sri Lanka's premier destination for high-quality LED lighting, electrical items, and designer bathware. Operating from our showroom in Negombo, we import and distribute top-tier products for residential, commercial, and hospitality projects across the island.",
  metaDescription: "Ocean Lighting Solutions – Premium LED lighting, electrical items, and luxury bathware in Negombo, Sri Lanka. Visit our showroom at 591, Chilaw Road, Kattuwa.",
};

// ─── CATEGORIES ─────────────────────────────────────────────────────────────

export const categories: Category[] = [
  // Lighting
  { id: "cat-l-01", name: "Indoor Lighting",      slug: "indoor-lighting",       description: "Chandeliers, pendants, downlights and wall lights for every interior.", icon: "💡", image: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=600&q=80" },
  { id: "cat-l-02", name: "Outdoor Lighting",     slug: "outdoor-lighting",      description: "Weather-resistant flood lights, garden lights and facade solutions.", icon: "🌿", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
  { id: "cat-l-03", name: "Commercial Lighting",  slug: "commercial-lighting",   description: "High-bay, panel and track lighting for offices, warehouses and retail.", icon: "🏢", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { id: "cat-l-04", name: "LED Bulbs",            slug: "led-bulbs",             description: "E27, E14, GU10 LED bulbs in all wattages and colour temperatures.", icon: "🔆", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80" },
  { id: "cat-l-05", name: "LED Tube Lights",      slug: "led-tube-lights",       description: "T8 and T5 LED tubes — direct replacement for fluorescent fittings.", icon: "📏", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80" },
  { id: "cat-l-06", name: "LED Ceiling Lights",   slug: "led-ceiling-lights",    description: "Flush-mount and semi-flush LED ceiling panels and oyster lights.", icon: "⭕", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: "cat-l-07", name: "LED Strip Lighting",   slug: "led-strip-lighting",    description: "RGB, warm white and cool white LED strips for accent and cove lighting.", icon: "〰️", image: "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?w=600&q=80" },
  { id: "cat-l-08", name: "LED Mirror Lights",    slug: "led-mirror-lights",     description: "Backlit LED mirrors with anti-fog and dimmer options.", icon: "🔲", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80" },
  { id: "cat-l-09", name: "LED Step Lights",      slug: "led-step-lights",       description: "Recessed and surface-mount stair LED lights for indoor and outdoor steps.", icon: "🪜", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { id: "cat-l-10", name: "Electrical Items",     slug: "electrical-items",      description: "MCB boards, switches, sockets, wiring accessories and extension leads.", icon: "⚡", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80" },
  // Bathware
  { id: "cat-b-01", name: "Toilets (WC)",               slug: "toilets",               description: "Wall-hung, close-coupled and smart toilets with rimless designs.", icon: "🚽", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80" },
  { id: "cat-b-02", name: "Wash Basins",                slug: "wash-basins",           description: "Counter-top, under-mount, wall-hung and pedestal wash basins.", icon: "🪣", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80" },
  { id: "cat-b-03", name: "Faucets & Mixers",           slug: "faucets-mixers",        description: "Bathroom and kitchen faucets in chrome, brushed gold and matte black.", icon: "🚰", image: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=600&q=80" },
  { id: "cat-b-04", name: "Showers",                    slug: "showers",               description: "Rain showers, thermostatic columns and handheld shower sets.", icon: "🚿", image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&q=80" },
  { id: "cat-b-05", name: "Bathroom Accessories",       slug: "bathroom-accessories",  description: "Towel rails, toilet roll holders, robe hooks and soap dispensers.", icon: "🧴", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80" },
  { id: "cat-b-06", name: "Bathroom Mirrors",           slug: "bathroom-mirrors",      description: "LED illuminated, anti-fog and framed bathroom mirrors in every size.", icon: "🪞", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80" },
  { id: "cat-b-07", name: "Vanity Units",               slug: "vanity-units",          description: "Wall-hung and floor-standing bathroom vanity units with basin combos.", icon: "🗄️", image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80" },
  { id: "cat-b-08", name: "Kitchen Sinks & Faucets",    slug: "kitchen-sinks-faucets", description: "Stainless steel and granite kitchen sinks with matching mixer taps.", icon: "🍽️", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
  { id: "cat-b-09", name: "Plumbing Accessories",       slug: "plumbing-accessories",  description: "Pipe fittings, traps, drain covers, stopcocks and installation hardware.", icon: "🔧", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80" },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────

export const products: Product[] = [
  // ── Indoor Lighting ──
  {
    id: "prod-001", name: "Crystal K9 Chandelier – Grand Series", slug: "crystal-k9-chandelier-grand-series", category: "indoor-lighting",
    shortDescription: "Premium K9 crystal chandelier for living rooms, lobbies and dining spaces",
    description: "Transform any grand interior with our Crystal K9 Chandelier. Precision-cut K9 crystal elements refract light into stunning spectrums. The champagne gold steel frame delivers structural elegance. Fully dimmable and compatible with E14 LED bulbs.",
    images: ["https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=800&q=80"],
    specifications: { "Material": "K9 Crystal + Champagne Gold Steel", "Diameter": "80cm", "Height": "60–120cm adjustable", "Bulb Type": "E14 LED", "Lights": "18", "Max Wattage": "90W", "Voltage": "220–240V" },
    features: ["Authentic K9 crystal", "Champagne gold plating", "Dimmable compatible", "Adjustable suspension cord", "3-year warranty"],
    isFeatured: true, badge: "Best Seller", createdAt: "2024-01-01", updatedAt: "2024-01-01",
  },
  {
    id: "prod-002", name: "Nordic Opal Pendant Light", slug: "nordic-opal-pendant-light", category: "indoor-lighting",
    shortDescription: "Scandinavian frosted opal glass pendant with brushed brass hardware",
    description: "Minimalist Nordic design with a frosted opaline glass orb that diffuses warm, glare-free ambient light. Perfect for kitchen islands, dining tables and boutique cafes. Brushed brass hardware with adjustable fabric cord.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
    specifications: { "Material": "Opal Glass + Brass", "Globe Diameter": "25cm", "Cord Length": "1.8m adjustable", "Bulb Type": "E27 LED", "Max Wattage": "40W", "Voltage": "220–240V" },
    features: ["Frosted glare-free glass", "Brushed brass accents", "Adjustable cord", "Easy installation", "Dimmable compatible"],
    isFeatured: true, isNew: true, badge: "Popular", createdAt: "2024-01-02", updatedAt: "2024-01-02",
  },
  {
    id: "prod-003", name: "LED Recessed Downlight 12W CCT", slug: "led-recessed-downlight-12w-cct", category: "indoor-lighting",
    shortDescription: "Ultra-slim recessed downlight — CCT switchable 3000K / 4000K / 6500K",
    description: "Flush-ceiling downlight at only 20mm depth with CCT colour switching between warm, neutral and cool white. High CRI >90 for accurate interior colour rendering. Die-cast aluminium housing for thermal management.",
    images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"],
    specifications: { "Power": "12W", "Luminous Flux": "1080 lm", "CCT": "3000K / 4000K / 6500K", "CRI": ">90", "Cut-out": "Ø105–115mm", "Depth": "20mm", "Voltage": "220–240V" },
    features: ["CCT changeable", "CRI >90", "Flicker-free", "Ultra-slim 20mm", "85% energy saving"],
    isFeatured: false, createdAt: "2024-01-03", updatedAt: "2024-01-03",
  },
  // ── Outdoor Lighting ──
  {
    id: "prod-004", name: "Titan LED Flood Light 100W", slug: "titan-led-flood-light-100w", category: "outdoor-lighting",
    shortDescription: "Commercial-grade IP66 flood light for facades, car parks and landscapes",
    description: "Heavy-duty outdoor LED flood light with die-cast aluminium housing and tempered glass cover. IP66 rated for all-weather conditions. 11,500 lumens output from 100W with a 120° wide beam angle.",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"],
    specifications: { "Power": "100W", "Luminous Flux": "11,500 lm", "CCT": "6000K", "IP Rating": "IP66", "Voltage": "100–265V AC", "Lifespan": "60,000 hrs", "Beam Angle": "120°" },
    features: ["IP66 weatherproof", "Die-cast aluminium", "120° beam angle", "Adjustable bracket", "6kV surge protection"],
    isFeatured: true, createdAt: "2024-01-04", updatedAt: "2024-01-04",
  },
  {
    id: "prod-005", name: "Solar Garden Spike Light", slug: "solar-garden-spike-light", category: "outdoor-lighting",
    shortDescription: "Solar-powered pathway spike light with auto dusk-to-dawn sensor — IP65",
    description: "Eco-friendly solar garden spike light with monocrystalline panel and lithium battery. Automatically turns on at dusk and off at dawn. Warm 2700K light creates a premium atmosphere along pathways and lawns.",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"],
    specifications: { "Solar Panel": "5V 2W Monocrystalline", "Battery": "3.7V 2000mAh Li-ion", "LED": "3W", "CCT": "2700K Warm Gold", "Charging": "5–6 hours", "Run Time": "10–12 hours", "IP Rating": "IP65" },
    features: ["100% solar powered", "Auto dusk-to-dawn", "IP65 weatherproof", "No wiring required", "Polished brass finish"],
    isFeatured: false, isNew: true, createdAt: "2024-01-05", updatedAt: "2024-01-05",
  },
  // ── Commercial Lighting ──
  {
    id: "prod-006", name: "Industrial High Bay LED 150W", slug: "industrial-high-bay-led-150w", category: "commercial-lighting",
    shortDescription: "High-output IP65 LED high bay for warehouses, factories and sports halls",
    description: "Engineered for demanding industrial environments, this high bay delivers 18,000 lumens from 150W with instant start and no warm-up time. IP65 housing withstands dust and moisture.",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"],
    specifications: { "Power": "150W", "Luminous Flux": "18,000 lm", "CCT": "5000K", "CRI": ">80", "IP Rating": "IP65", "Voltage": "100–277V AC", "Lifespan": "60,000 hrs" },
    features: ["High lumen output", "IP65 rated", "Instant start", "Wide beam 120°", "5-year warranty"],
    isFeatured: true, createdAt: "2024-01-06", updatedAt: "2024-01-06",
  },
  {
    id: "prod-007", name: "LED Track Lighting System – 3-Phase", slug: "led-track-lighting-system-3-phase", category: "commercial-lighting",
    shortDescription: "Adjustable 3-phase track lighting for retail, galleries and showrooms",
    description: "Professional-grade 3-phase track lighting with individually adjustable spotlights. Each head rotates 350° and tilts 90° for precise directional lighting. Available in matte black and white finishes.",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"],
    specifications: { "Track Length": "1m / 2m / 3m", "Spotlight Power": "15W each", "CCT": "3000K / 4000K", "CRI": ">90", "Beam Angle": "24° / 36°", "Voltage": "220–240V", "Finish": "Matte Black / White" },
    features: ["360° rotatable heads", "90° tilt", "Modular design", "Dimmable compatible", "CRI >90"],
    isFeatured: false, createdAt: "2024-01-07", updatedAt: "2024-01-07",
  },
  // ── LED Bulbs ──
  {
    id: "prod-008", name: "LED Bulb E27 9W Warm White", slug: "led-bulb-e27-9w-warm-white", category: "led-bulbs",
    shortDescription: "E27 9W LED bulb — replaces 60W incandescent, 2700K warm white",
    description: "High-efficiency E27 LED bulb replacing a 60W incandescent while consuming only 9W. Warm white 2700K tone for a cosy atmosphere. Instant full brightness with no flicker and 25,000-hour lifespan.",
    images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"],
    specifications: { "Power": "9W", "Equivalent": "60W incandescent", "Lumens": "810 lm", "CCT": "2700K Warm White", "Base": "E27", "Lifespan": "25,000 hrs", "Voltage": "220–240V" },
    features: ["Replaces 60W", "Instant full brightness", "Flicker-free", "85% energy saving", "25,000 hr lifespan"],
    isFeatured: false, createdAt: "2024-01-08", updatedAt: "2024-01-08",
  },
  {
    id: "prod-009", name: "LED GU10 Spotlight 5W Dimmable", slug: "led-gu10-spotlight-5w-dimmable", category: "led-bulbs",
    shortDescription: "Dimmable GU10 LED spotlight for recessed fittings and track lighting",
    description: "Precise directional GU10 LED spotlight compatible with standard dimmer switches. 36° beam angle focuses light where needed. Ideal for recessed downlights and track lighting systems.",
    images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"],
    specifications: { "Power": "5W", "Lumens": "400 lm", "CCT": "3000K / 4000K", "Base": "GU10", "Beam Angle": "36°", "Dimmable": "Yes", "Voltage": "220–240V" },
    features: ["Dimmable", "36° spot beam", "GU10 universal fit", "Instant start", "CRI >80"],
    isFeatured: false, isNew: true, createdAt: "2024-01-09", updatedAt: "2024-01-09",
  },
  // ── LED Tube Lights ──
  {
    id: "prod-010", name: "LED T8 Tube Light 18W 4ft", slug: "led-t8-tube-light-18w-4ft", category: "led-tube-lights",
    shortDescription: "18W T8 LED tube — direct replacement for 36W fluorescent, 4000K",
    description: "Direct replacement for 36W T8 fluorescent tubes. Nano-plastic diffuser provides even light distribution without glare. Aluminium heat sink ensures consistent performance and long life.",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"],
    specifications: { "Power": "18W", "Lumens": "1800 lm", "CCT": "4000K Neutral White", "Length": "1200mm (4ft)", "Base": "G13", "Lifespan": "30,000 hrs", "Voltage": "220–240V" },
    features: ["Direct fluorescent replacement", "Nano-plastic diffuser", "Aluminium heat sink", "No flicker", "30,000 hr lifespan"],
    isFeatured: false, createdAt: "2024-01-10", updatedAt: "2024-01-10",
  },
  // ── LED Ceiling Lights ──
  {
    id: "prod-011", name: "Round LED Oyster Ceiling Light 24W", slug: "round-led-oyster-ceiling-light-24w", category: "led-ceiling-lights",
    shortDescription: "Modern flush-mount LED ceiling oyster — 24W, 3-CCT switchable",
    description: "Slim flush-mount oyster ceiling light with frosted acrylic cover for even light distribution. 3-CCT switch selects warm, neutral or cool white. Suitable for bedrooms, hallways and living areas.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
    specifications: { "Power": "24W", "Lumens": "2200 lm", "CCT": "3000K / 4000K / 6500K", "Diameter": "380mm", "Depth": "65mm", "Voltage": "220–240V", "IP Rating": "IP20" },
    features: ["3-CCT switchable", "Frosted acrylic cover", "Slim 65mm depth", "Flicker-free", "Easy ceiling mount"],
    isFeatured: false, createdAt: "2024-01-11", updatedAt: "2024-01-11",
  },
  {
    id: "prod-012", name: "LED Panel Light 60W – 600×600mm", slug: "led-panel-light-60w-600x600", category: "led-ceiling-lights",
    shortDescription: "Ultra-slim 600×600mm LED panel for offices and suspended ceilings",
    description: "Engineered for commercial suspended ceiling grids. Uniform light distribution with no hot spots. Slim 10mm profile with driver included. High CRI >80 for accurate office and retail colour rendering.",
    images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"],
    specifications: { "Power": "60W", "Lumens": "5400 lm", "CCT": "4000K / 6500K", "CRI": ">80", "Dimensions": "600×600×10mm", "IP Rating": "IP40", "Voltage": "220–240V" },
    features: ["10mm ultra-slim", "Uniform distribution", "Flicker-free", "Driver included", "2-year warranty"],
    isFeatured: true, badge: "Best Seller", createdAt: "2024-01-12", updatedAt: "2024-01-12",
  },
  // ── LED Strip Lighting ──
  {
    id: "prod-013", name: "Smart RGB LED Strip 5m WiFi", slug: "smart-rgb-led-strip-5m-wifi", category: "led-strip-lighting",
    shortDescription: "WiFi-enabled RGB LED strip with app control and Alexa/Google compatibility",
    description: "Create stunning ambient lighting with 16 million colours and music sync mode. Control via app or voice commands (Alexa, Google Home). Self-adhesive backing, cuttable every 3 LEDs. Ideal for TV backlighting and cove lighting.",
    images: ["https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?w=800&q=80"],
    specifications: { "Length": "5 metres", "LEDs": "300 (60/m)", "Power": "24W", "Voltage": "12V DC", "Connectivity": "WiFi 2.4GHz", "Compatibility": "Alexa, Google Home", "Colors": "16M RGB" },
    features: ["App and voice control", "16M colours", "Music sync mode", "Cuttable design", "Self-adhesive backing"],
    isFeatured: true, isNew: true, badge: "Smart", createdAt: "2024-01-13", updatedAt: "2024-01-13",
  },
  {
    id: "prod-014", name: "Warm White LED Strip 12V 5m", slug: "warm-white-led-strip-12v-5m", category: "led-strip-lighting",
    shortDescription: "2700K warm white LED strip for under-cabinet, cove and accent lighting",
    description: "Consistent warm white 2700K output for cove lighting, under-cabinet and decorative accent applications. SMD2835 chips with CRI >80. IP20 indoor rated. Includes connector and power supply.",
    images: ["https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?w=800&q=80"],
    specifications: { "Length": "5 metres", "LEDs": "300 SMD2835", "Power": "15W", "CCT": "2700K Warm White", "CRI": ">80", "IP Rating": "IP20", "Voltage": "12V DC" },
    features: ["Consistent warm tone", "CRI >80", "Cuttable strips", "Includes power supply", "Easy peel-and-stick"],
    isFeatured: false, createdAt: "2024-01-14", updatedAt: "2024-01-14",
  },
  // ── LED Mirror Lights ──
  {
    id: "prod-015", name: "Lumina LED Anti-Fog Smart Mirror", slug: "lumina-led-anti-fog-smart-mirror", category: "led-mirror-lights",
    shortDescription: "Backlit LED bathroom mirror with touch sensor, anti-fog and 3-CCT",
    description: "Shadow-free backlit LED mirror with built-in demister pad and touch sensor. Three colour temperatures — warm, neutral and cool — selected by single touch. High-CRI LEDs for true colour in grooming routines.",
    images: ["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80"],
    specifications: { "Glass": "5mm Copper-Free HD", "LED": "CRI >90", "CCT": "3000K / 4000K / 6000K", "Size": "800×600mm", "IP Rating": "IP44", "Voltage": "220–240V", "Demister": "Built-in auto" },
    features: ["Touch sensor dimming", "Anti-fog demister", "3-CCT colour switching", "CRI >90", "IP44 splashproof"],
    isFeatured: true, badge: "Best Seller", createdAt: "2024-01-15", updatedAt: "2024-01-15",
  },
  // ── LED Step Lights ──
  {
    id: "prod-016", name: "Recessed LED Step Light 3W", slug: "recessed-led-step-light-3w", category: "led-step-lights",
    shortDescription: "Recessed stainless steel step light — IP65, warm white, indoor & outdoor",
    description: "Slim recessed LED step light with stainless steel faceplate that blends into walls and risers. IP65 rated for outdoor use. Warm white 3000K provides safe, atmospheric guidance on stairs and pathways.",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"],
    specifications: { "Power": "3W", "CCT": "3000K Warm White", "IP Rating": "IP65", "Material": "Stainless Steel Face", "Cut-out": "82×42mm", "Voltage": "220–240V", "Lifespan": "30,000 hrs" },
    features: ["IP65 outdoor rated", "Stainless steel face", "Recessed flush mount", "Warm atmospheric light", "Low 3W consumption"],
    isFeatured: false, isNew: true, createdAt: "2024-01-16", updatedAt: "2024-01-16",
  },
  // ── Electrical Items ──
  {
    id: "prod-017", name: "MCB Distribution Board 8 Way", slug: "mcb-distribution-board-8-way", category: "electrical-items",
    shortDescription: "8-way MCB consumer unit for residential and light commercial wiring",
    description: "Flame-retardant ABS MCB distribution board for reliable circuit protection. DIN rail mounted with a transparent cover for easy inspection. Suitable for residential homes and light commercial fit-outs.",
    images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80"],
    specifications: { "Ways": "8", "Main Switch": "63A", "Voltage": "240V / 415V", "IP Rating": "IP40", "Material": "Flame-retardant ABS", "Standard": "IEC 60439", "Mounting": "DIN Rail" },
    features: ["Flame-retardant housing", "DIN rail mounted", "Transparent cover", "Easy cable management", "IEC 60439 compliant"],
    isFeatured: false, createdAt: "2024-01-17", updatedAt: "2024-01-17",
  },
  {
    id: "prod-018", name: "Smart Touch Wall Switch 2 Gang", slug: "smart-touch-wall-switch-2-gang", category: "electrical-items",
    shortDescription: "WiFi 2-gang touch switch with Alexa and Google Home compatibility",
    description: "Sleek tempered glass touch switch with built-in WiFi for smart home integration. Control lights from the wall, your phone, or by voice. Available in gloss white and gloss black.",
    images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80"],
    specifications: { "Gangs": "2", "Voltage": "220–240V AC", "Max Load": "600W per gang", "Connectivity": "WiFi 2.4GHz", "Compatible": "Alexa, Google, Tuya", "Material": "Tempered Glass", "Size": "86×86mm" },
    features: ["WiFi smart control", "Voice assistant compatible", "Tempered glass panel", "App scheduling", "LED status backlight"],
    isFeatured: false, isNew: true, badge: "Smart", createdAt: "2024-01-18", updatedAt: "2024-01-18",
  },
  // ── Toilets (WC) ──
  {
    id: "prod-019", name: "Smart Toilet with Bidet – Rimless", slug: "smart-toilet-bidet-rimless", category: "toilets",
    shortDescription: "Intelligent rimless toilet with bidet, heated seat and auto flush",
    description: "The pinnacle of bathroom luxury. Heated seat, front and rear bidet wash, warm air dryer, automatic deodorizer, and touchless motion-activated lid. Rimless design for hygienic, easy cleaning.",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"],
    specifications: { "Material": "Vitreous China (Antibacterial)", "Flush": "Tornado Siphon Dual-flush", "Seat Heating": "4 levels", "Voltage": "220–240V AC", "Dimensions": "680×410×470mm", "IP Rating": "IPX4" },
    features: ["Motion-activated lid", "Tornado dual flush", "Self-cleaning nozzle", "LED nightlight", "Eco power saving"],
    isFeatured: true, isNew: true, badge: "Signature", createdAt: "2024-01-19", updatedAt: "2024-01-19",
  },
  {
    id: "prod-020", name: "Close-Coupled Toilet Suite – Gloss White", slug: "close-coupled-toilet-suite-gloss-white", category: "toilets",
    shortDescription: "Classic close-coupled toilet with soft-close seat and dual flush",
    description: "Timeless close-coupled toilet in high-gloss vitreous china. Dual flush 3/6 litre cistern for water efficiency. Soft-close quick-release seat for easy cleaning.",
    images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"],
    specifications: { "Material": "Vitreous China", "Flush": "Dual Flush 3L / 6L", "Seat": "Soft-close quick-release", "Dimensions": "665×360×780mm", "Colour": "Gloss White" },
    features: ["Dual flush", "Soft-close seat", "Quick-release for cleaning", "Gloss white finish", "Easy installation"],
    isFeatured: false, createdAt: "2024-01-20", updatedAt: "2024-01-20",
  },
  // ── Wash Basins ──
  {
    id: "prod-021", name: "Counter-Top Vessel Basin – Matte White", slug: "counter-top-vessel-basin-matte-white", category: "wash-basins",
    shortDescription: "Oval counter-top vessel basin in premium matte white ceramic",
    description: "A striking oval vessel basin in smooth matte white ceramic. Sits on top of any vanity unit or console. Overflow slot included. Pairs beautifully with wall-mounted or tall basin faucets.",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80"],
    specifications: { "Material": "Sanitary Ceramic", "Finish": "Matte White", "Shape": "Oval", "Dimensions": "420×320×145mm", "Overflow": "Yes", "Drain": "32mm" },
    features: ["Premium matte ceramic", "Overflow included", "Easy-clean surface", "Scratch resistant", "Counter-top installation"],
    isFeatured: true, createdAt: "2024-01-21", updatedAt: "2024-01-21",
  },
  {
    id: "prod-022", name: "Wall-Hung Basin 550mm – Gloss White", slug: "wall-hung-basin-550mm-gloss-white", category: "wash-basins",
    shortDescription: "Modern wall-hung basin for easy floor cleaning and minimal design",
    description: "Clean-lined wall-hung basin in high-fired vitreous china. Floating design makes floor cleaning effortless. Back-to-wall bracket included for solid wall fixing.",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80"],
    specifications: { "Material": "Vitreous China", "Width": "550mm", "Depth": "420mm", "Overflow": "Yes", "Tap Holes": "1 central", "Fixing": "Bracket included" },
    features: ["Wall-hung floating design", "Easy floor cleaning", "Overflow included", "1 tap hole", "Bracket supplied"],
    isFeatured: false, isNew: true, createdAt: "2024-01-22", updatedAt: "2024-01-22",
  },
  // ── Faucets & Mixers ──
  {
    id: "prod-023", name: "Waterfall Basin Faucet – Matte Black", slug: "waterfall-basin-faucet-matte-black", category: "faucets-mixers",
    shortDescription: "Designer single-lever waterfall basin mixer in fingerprint-resistant matte black",
    description: "Statement faucet with a wide waterfall spout. Sedal ceramic cartridge for drip-free reliability. Matte black electroplated finish resists fingerprints and rust.",
    images: ["https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&q=80"],
    specifications: { "Body": "H59 Solid Brass", "Finish": "Matte Black", "Spout": "Wide Waterfall", "Cartridge": "Ceramic Disc", "Height": "180mm", "Spout Reach": "120mm", "Hoses": "2×60cm flexible" },
    features: ["Waterfall design", "Ceramic disc cartridge", "Fingerprint-resistant", "Eco water restrictor", "Single-lever operation"],
    isFeatured: true, isNew: true, badge: "New Arrival", createdAt: "2024-01-23", updatedAt: "2024-01-23",
  },
  {
    id: "prod-024", name: "Basin Mixer Tap – Chrome", slug: "basin-mixer-tap-chrome", category: "faucets-mixers",
    shortDescription: "Classic single-lever basin mixer in polished chrome — universal fit",
    description: "Versatile, timeless basin mixer tap in polished chrome. Single lever controls temperature and flow rate. Includes flexible braided hoses and easy-fit mounting hardware.",
    images: ["https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&q=80"],
    specifications: { "Body": "Brass", "Finish": "Polished Chrome", "Type": "Single-lever mixer", "Spout Reach": "110mm", "Cartridge": "Ceramic 40mm", "Hoses": "Included" },
    features: ["Polished chrome finish", "Single-lever control", "Ceramic cartridge", "Hoses included", "Universal fit"],
    isFeatured: false, createdAt: "2024-01-24", updatedAt: "2024-01-24",
  },
  // ── Showers ──
  {
    id: "prod-025", name: "Thermostatic Rain Shower Column – Brushed Gold", slug: "thermostatic-rain-shower-column-brushed-gold", category: "showers",
    shortDescription: "Luxury thermostatic shower column with 300mm overhead rain and 3-way diverter",
    description: "The thermostatic safety valve locks temperature at 38°C. 300mm overhead rain face delivers a soothing downpour. 3-way diverter controls rain, hand shower and tub spout independently.",
    images: ["https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80"],
    specifications: { "Valve": "Solid DZR Brass", "Finish": "Brushed Gold PVD", "Overhead Shower": "300×300mm", "Temp Control": "Thermostatic 38°C lock", "Hose": "1.5m anti-twist", "Min Pressure": "1.0 Bar" },
    features: ["Thermostatic 38°C safety lock", "Brushed Gold PVD finish", "Anti-limescale nozzles", "3-way diverter", "300mm rain head"],
    isFeatured: true, badge: "Premium", createdAt: "2024-01-25", updatedAt: "2024-01-25",
  },
  {
    id: "prod-026", name: "Overhead Rain Shower Set – Chrome 250mm", slug: "overhead-rain-shower-set-chrome-250mm", category: "showers",
    shortDescription: "250mm chrome overhead rain shower with adjustable wall arm and handheld set",
    description: "Complete shower set with a 250mm overhead rain shower head, wall-mount adjustable arm, and handheld shower on a 1.5m hose. All fittings in polished chrome. Standard G½ connections.",
    images: ["https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80"],
    specifications: { "Overhead Shower": "250mm", "Arm": "Wall-mount adjustable", "Handheld": "Included", "Hose": "1.5m", "Finish": "Polished Chrome", "Connection": "G½" },
    features: ["250mm rain shower", "Adjustable wall arm", "Handheld included", "Anti-limescale jets", "Easy G½ connection"],
    isFeatured: false, isNew: true, createdAt: "2024-01-26", updatedAt: "2024-01-26",
  },
  // ── Bathroom Accessories ──
  {
    id: "prod-027", name: "Heated Towel Rail – 600×800mm Chrome", slug: "heated-towel-rail-600x800mm-chrome", category: "bathroom-accessories",
    shortDescription: "Electric heated towel rail in polished chrome — 600×800mm, IP44",
    description: "Keep towels warm with this electric heated towel rail in polished chrome. IP44-rated with programmable timer for energy efficiency. 7 horizontal bars, 300W.",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80"],
    specifications: { "Dimensions": "600×800mm", "Finish": "Polished Chrome", "Type": "Electric", "Wattage": "300W", "IP Rating": "IP44", "Bars": "7 horizontal", "Timer": "Programmable" },
    features: ["Electric heating", "Polished chrome", "IP44 rated", "Programmable timer", "Wall-mounted"],
    isFeatured: false, createdAt: "2024-01-27", updatedAt: "2024-01-27",
  },
  {
    id: "prod-028", name: "5-Piece Bathroom Accessory Set – Matte Black", slug: "5-piece-bathroom-accessory-set-matte-black", category: "bathroom-accessories",
    shortDescription: "Matching matte black 5-piece set: towel rail, robe hook, roll holder, soap dish, towel ring",
    description: "Coordinate your bathroom with this matching matte black 5-piece set. Includes double towel rail, robe hook, toilet roll holder, soap dish, and towel ring. Zinc alloy with durable matte black powder-coat.",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80"],
    specifications: { "Material": "Zinc Alloy", "Finish": "Matte Black", "Pieces": "5", "Fixing": "Wall-mount, fixings included" },
    features: ["Matching 5-piece set", "Matte black finish", "Zinc alloy", "All fixings included", "Modern minimalist style"],
    isFeatured: false, isNew: true, createdAt: "2024-01-28", updatedAt: "2024-01-28",
  },
  // ── Bathroom Mirrors ──
  {
    id: "prod-029", name: "LED Mirror Cabinet – 700×650mm", slug: "led-mirror-cabinet-700x650mm", category: "bathroom-mirrors",
    shortDescription: "Wall-mount aluminium mirror cabinet with LED lighting, shaver socket and clock",
    description: "Moisture-proof anodised aluminium cabinet with dual double-sided mirror doors and vertical LED bars. Internal glass shelves, shaver socket, and sensor switch included.",
    images: ["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80"],
    specifications: { "Material": "Anodised Aluminium", "Dimensions": "700×650×135mm", "LED": "Front and interior", "Socket": "230V shaver", "Shelves": "3 adjustable glass", "IP Rating": "IP44" },
    features: ["Dual mirror doors", "Internal LED lighting", "Shaver socket", "Soft-close hinges", "Sensor switch"],
    isFeatured: true, createdAt: "2024-01-29", updatedAt: "2024-01-29",
  },
  {
    id: "prod-030", name: "Framed Bathroom Mirror – Black 800×600mm", slug: "framed-bathroom-mirror-black-800x600mm", category: "bathroom-mirrors",
    shortDescription: "Sleek slim-frame bathroom mirror in matte black aluminium — 800×600mm",
    description: "Simple, stylish framed bathroom mirror with a slim matte black aluminium border. Copper-free mirror glass for long-lasting clarity. Can be hung portrait or landscape.",
    images: ["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80"],
    specifications: { "Frame": "Slim Aluminium Matte Black", "Glass": "Copper-free HD mirror", "Dimensions": "800×600mm", "Frame Width": "15mm", "Orientation": "Portrait or Landscape" },
    features: ["Copper-free HD glass", "15mm slim frame", "Portrait or landscape", "Matte black finish", "Hardware included"],
    isFeatured: false, createdAt: "2024-01-30", updatedAt: "2024-01-30",
  },
  // ── Vanity Units ──
  {
    id: "prod-031", name: "Wall-Hung Vanity Unit 800mm – Grey Oak", slug: "wall-hung-vanity-unit-800mm-grey-oak", category: "vanity-units",
    shortDescription: "800mm wall-hung vanity unit with soft-close drawers and basin included",
    description: "Contemporary wall-hung bathroom vanity in grey oak finish. Two soft-close push-to-open drawers. White gloss ceramic basin included. Creates a clean floating look that makes any bathroom feel larger.",
    images: ["https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80"],
    specifications: { "Width": "800mm", "Depth": "460mm", "Height": "500mm", "Finish": "Grey Oak", "Drawers": "2 soft-close", "Basin": "White gloss ceramic included" },
    features: ["Floating wall-hung design", "2 soft-close drawers", "Basin included", "Grey oak finish", "Push-to-open mechanism"],
    isFeatured: true, isNew: true, createdAt: "2024-01-31", updatedAt: "2024-01-31",
  },
  // ── Kitchen Sinks & Faucets ──
  {
    id: "prod-032", name: "Undermount Kitchen Sink – 1.5 Bowl Stainless", slug: "undermount-kitchen-sink-1-5-bowl-stainless", category: "kitchen-sinks-faucets",
    shortDescription: "1.5 bowl undermount kitchen sink in heavy-duty 18/10 brushed stainless steel",
    description: "Professional-grade 18/10 stainless steel kitchen sink with main bowl and prep bowl. Undermount installation gives a seamless countertop finish. Includes waste fittings and anti-condensation coating.",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"],
    specifications: { "Material": "18/10 Stainless Steel", "Gauge": "1.0mm heavy-duty", "Type": "1.5 Bowl Undermount", "Main Bowl": "370×420×200mm", "Drain": "90mm basket strainer", "Coating": "Anti-condensation" },
    features: ["18/10 food-grade steel", "Undermount installation", "Anti-condensation coating", "Waste fittings included", "Sound-deadening pads"],
    isFeatured: false, createdAt: "2024-02-01", updatedAt: "2024-02-01",
  },
  {
    id: "prod-033", name: "Pull-Out Kitchen Mixer Faucet – Chrome", slug: "pull-out-kitchen-mixer-faucet-chrome", category: "kitchen-sinks-faucets",
    shortDescription: "Single-lever pull-out kitchen faucet with dual spray modes — polished chrome",
    description: "Versatile pull-out kitchen faucet with 1.5m hose and dual spray modes (stream and spray). Single lever controls temperature and flow. Solid brass body with ceramic cartridge.",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"],
    specifications: { "Body": "Solid Brass", "Finish": "Polished Chrome", "Spray": "Stream + Spray", "Hose": "1.5m pull-out", "Cartridge": "Ceramic disc", "Spout Height": "250mm" },
    features: ["Pull-out dual spray", "1.5m flexible hose", "Ceramic cartridge", "Single lever control", "Universal G½ connection"],
    isFeatured: false, isNew: true, createdAt: "2024-02-02", updatedAt: "2024-02-02",
  },
  // ── Plumbing Accessories ──
  {
    id: "prod-034", name: "Push-Fit Pipe Fitting Kit – 15mm & 22mm", slug: "push-fit-pipe-fitting-kit-15mm-22mm", category: "plumbing-accessories",
    shortDescription: "20-piece push-fit pipe fitting kit in 15mm and 22mm — elbows, tees and couplings",
    description: "Complete push-fit fitting kit for quick, tool-free plumbing connections. Compatible with copper and CPVC pipe. Includes elbows, straight couplings, tee fittings and end stops in 15mm and 22mm sizes.",
    images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"],
    specifications: { "Sizes": "15mm and 22mm", "Pieces": "20 assorted", "Material": "Lead-free Brass + Acetal", "Compatibility": "Copper and CPVC", "Max Pressure": "10 Bar", "Temp": "Up to 95°C" },
    features: ["Tool-free push-fit", "Lead-free brass", "20 assorted pieces", "Hot and cold rated", "BS EN ISO 21003"],
    isFeatured: false, createdAt: "2024-02-03", updatedAt: "2024-02-03",
  },
];

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Priya Jayawardena",
    role: "Interior Designer",
    company: "Luxe Interiors Colombo",
    content: "Ocean Lighting Solutions has been my go-to supplier for all lighting and bathware projects. Their product quality is exceptional and the team is incredibly knowledgeable. My clients are always impressed with the results.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Chaminda Perera",
    role: "Hotel Manager",
    company: "Serenity Beach Resort",
    content: "We renovated our entire hotel with lighting and bathware from Ocean Lighting. The transformation was remarkable — professional service, premium products, and excellent after-sales support. Highly recommended!",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Nimal Fernando",
    role: "Homeowner",
    company: "Negombo",
    content: "Visited their showroom and was amazed by the variety. The staff helped me choose the perfect lighting and bathroom fittings for my new home. The installation was smooth and the results are stunning.",
    rating: 5,
  },
  {
    id: "test-4",
    name: "Dilani Wickramasinghe",
    role: "Architect",
    company: "DW Architecture",
    content: "As an architect I need reliable suppliers who understand design. Ocean Lighting consistently delivers premium products on time. Their LED solutions and bathware have transformed many of my projects.",
    rating: 5,
  },
];

// ─── BRANDS ─────────────────────────────────────────────────────────────────

export const brands: Brand[] = [
  { id: "brand-1", name: "Philips",   logo: "/brands/philips.svg" },
  { id: "brand-2", name: "Osram",     logo: "/brands/osram.svg" },
  { id: "brand-3", name: "Grohe",     logo: "/brands/grohe.svg" },
  { id: "brand-4", name: "Kohler",    logo: "/brands/kohler.svg" },
  { id: "brand-5", name: "TOTO",      logo: "/brands/toto.svg" },
  { id: "brand-6", name: "Roca",      logo: "/brands/roca.svg" },
  { id: "brand-7", name: "Jaquar",    logo: "/brands/jaquar.svg" },
  { id: "brand-8", name: "Panasonic", logo: "/brands/panasonic.svg" },
];

// ─── GALLERY ─────────────────────────────────────────────────────────────────

export const galleryItems: GalleryItem[] = [
  { id: "gal-1", title: "Luxury Hotel Suite Bathroom",   description: "Complete bathware and lighting setup for a 5-star hotel villa",  image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80", category: "Commercial" },
  { id: "gal-2", title: "Modern Office Reception",       description: "Architectural LED panels and downlight layout",                    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", category: "Commercial" },
  { id: "gal-3", title: "Residential Penthouse Bath",    description: "Freestanding basin and warm LED ambient strip setup",              image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80", category: "Residential" },
  { id: "gal-4", title: "Luxury Garden Pathways",        description: "Solar spike lights and pathway illumination",                     image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80", category: "Outdoor" },
  { id: "gal-5", title: "Boutique Restaurant Dining",    description: "Opal glass pendant lighting and brass feature fixtures",           image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", category: "Commercial" },
  { id: "gal-6", title: "Minimalist Master Bath Suite",  description: "LED anti-fog mirrors and matte black waterfall faucets",           image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80", category: "Residential" },
];
