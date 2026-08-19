import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Sparkles, Facebook, Instagram } from "lucide-react";
import { siteSettings } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-xl tracking-wider text-white leading-none">
                  OCEAN
                </div>
                <div className="text-[9px] text-gold font-semibold tracking-wider uppercase leading-none mt-1">
                  Lighting Solutions
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sri Lanka&apos;s premier brand for high-end LED lighting, designer sanitaryware, and luxury bathware solutions.
            </p>
            <div className="flex gap-3">
              {siteSettings.socialMedia?.facebook && (
                <a
                  href={siteSettings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-brand-primary rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {siteSettings.socialMedia?.instagram && (
                <a
                  href={siteSettings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-brand-primary rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/",         label: "Home" },
                { href: "/lighting", label: "Lighting" },
                { href: "/bathware", label: "Bathware" },
                { href: "/projects", label: "Projects" },
                { href: "/gallery",  label: "Gallery" },
                { href: "/about",    label: "About Us" },
                { href: "/contact",  label: "Contact" },
                { href: "/wishlist", label: "My Wishlist" },
                { href: "/faq",      label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gold rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lighting */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Lighting</h3>
            <ul className="space-y-3">
              {[
                { href: "/lighting",                                label: "All Lighting" },
                { href: "/lighting?category=indoor-lighting",      label: "Indoor Lighting" },
                { href: "/lighting?category=outdoor-lighting",     label: "Outdoor Lighting" },
                { href: "/lighting?category=commercial-lighting",  label: "Commercial Lighting" },
                { href: "/lighting?category=led-bulbs",            label: "LED Bulbs" },
                { href: "/lighting?category=led-tube-lights",      label: "LED Tube Lights" },
                { href: "/lighting?category=led-ceiling-lights",   label: "LED Ceiling Lights" },
                { href: "/lighting?category=led-strip-lighting",   label: "LED Strip Lighting" },
                { href: "/lighting?category=led-mirror-lights",    label: "LED Mirror Lights" },
                { href: "/lighting?category=electrical-items",     label: "Electrical Items" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bathware */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Bathware</h3>
            <ul className="space-y-3">
              {[
                { href: "/bathware",                                      label: "All Bathware" },
                { href: "/bathware?category=toilets",                     label: "Toilets (WC)" },
                { href: "/bathware?category=wash-basins",                 label: "Wash Basins" },
                { href: "/bathware?category=faucets-mixers",              label: "Faucets & Mixers" },
                { href: "/bathware?category=showers",                     label: "Showers" },
                { href: "/bathware?category=bathroom-accessories",        label: "Bathroom Accessories" },
                { href: "/bathware?category=bathroom-mirrors",            label: "Bathroom Mirrors" },
                { href: "/bathware?category=vanity-units",                label: "Vanity Units" },
                { href: "/bathware?category=kitchen-sinks-faucets",       label: "Kitchen Sinks & Faucets" },
                { href: "/bathware?category=plumbing-accessories",        label: "Plumbing Accessories" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-gold text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  {siteSettings.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${siteSettings.telephone.replace(/\s/g, "")}`}
                  className="flex gap-3 text-gray-400 hover:text-gold text-sm transition-colors"
                >
                  <Phone size={16} className="text-gold shrink-0" />
                  <div>
                    <div>{siteSettings.telephone}</div>
                    <div>{siteSettings.mobile}</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="flex gap-3 text-gray-400 hover:text-gold text-sm transition-colors"
                >
                  <Mail size={16} className="text-gold shrink-0" />
                  {siteSettings.email}
                </a>
              </li>
              
              <li className="flex gap-3">
                <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                <div className="text-gray-400 text-sm space-y-1">
                  <div>{siteSettings.businessHours.weekdays}</div>
                  <div>{siteSettings.businessHours.saturday}</div>
                  <div>{siteSettings.businessHours.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Ocean Lighting Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-gold text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gold text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

