import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import bgFooter from "@/assets/bg-footer.jpg";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isMobile) {
    return (
      <div>
        <h3 className="font-heading font-semibold mb-4 text-base">{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <div className="border-b border-primary-foreground/10 pb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 font-heading font-semibold text-base"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const settings = useSiteSettingsStore((s) => s.settings);
  const footerBackground = settings.heroImages.footer || bgFooter;
  return (
    <footer className="relative z-10 w-full shrink-0 overflow-hidden bg-[#071A2E] text-primary-foreground">
      <img
        src={footerBackground}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-navy/88" />
      <div className="container relative z-10 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="WaterFilterStore home"
              className="mb-4 inline-flex rounded-xl bg-white p-1.5 shadow-sm transition hover:shadow-md"
            >
              <img
                src="/images/water-filter-store-logo.jpeg"
                alt="WaterFilterStore — Get everything about water at one Click"
                className="h-16 w-28 rounded-lg object-contain sm:h-[72px] sm:w-32"
                width="128"
                height="72"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-sm opacity-70 leading-relaxed mb-4">
              Providing clean, safe, and healthy water solutions for homes and businesses across India since 2006.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.facebook.com/share/v/1D86G96Zaf/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <span className="sr-only">Visit WaterFilterStore on Facebook</span>
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <CollapsibleSection title="Quick Links">
            <ul className="space-y-2.5 text-sm opacity-70">
              {[
                { label: "Products", to: "/products" },
                { label: "About Us", to: "/about" },
                { label: "Blog", to: "/blog" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:opacity-100 transition-opacity hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Categories */}
          <CollapsibleSection title="Categories">
            <ul className="space-y-2.5 text-sm opacity-70">
              {[
                { label: "RO Purifiers", slug: "ro-purifiers" },
                { label: "Industrial Water Solutions", slug: "uv-purifiers" },
                { label: "Gravity Purifiers", slug: "gravity-purifiers" },
                { label: "Filters & Cartridges", slug: "filters-cartridges" },
                { label: "Commercial Plants", slug: "commercial" },
                { label: "Accessories", slug: "accessories" },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/products?category=${cat.slug}`} className="hover:opacity-100 transition-opacity hover:underline">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Contact - always visible */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-base">Contact Us</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li>
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:opacity-100">
                  <Phone className="h-4 w-4" /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:opacity-100">
                  <Mail className="h-4 w-4" /> {settings.email}
                </a>
              </li>
            </ul>
            <p className="text-xs opacity-50 mt-4">GSTIN: {settings.gstin}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 relative z-10">
        <div className="container py-4 text-xs opacity-50">
          <p className="hidden sm:block text-center">
            © 2006 WaterFilterStore. All rights reserved. | Powered by Aqua Safe Water Technologies | Developed by{" "}
            <a
              href="https://www.octaleads.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-100"
            >
              Octaleads
            </a>
          </p>
          <div className="sm:hidden flex flex-col items-center gap-1 text-center">
            <p>© 2006 WaterFilterStore. All rights reserved.</p>
            <p>
              Powered by Aqua Safe Water Technologies | Developed by{" "}
              <a
                href="https://www.octaleads.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100"
              >
                Octaleads
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
