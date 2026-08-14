import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, ChevronDown, ChevronRight, User, MapPin, Phone } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { categories } from "@/data/categories";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";

import megaRo from "@/assets/mega-ro.jpg";
import megaUv from "@/assets/mega-uv.jpg";
import megaGravity from "@/assets/mega-gravity.jpg";
import megaFilters from "@/assets/mega-filters.jpg";
import megaCommercial from "@/assets/mega-commercial.jpg";
import megaAccessories from "@/assets/mega-accessories.jpg";

const categoryImages: Record<string, string> = {
  "ro-purifiers": megaRo,
  "uv-purifiers": megaUv,
  "gravity-purifiers": megaGravity,
  "filters-cartridges": megaFilters,
  commercial: megaCommercial,
  accessories: megaAccessories,
};

const navLinks = [
  { label: "Products", to: "/products", hasDropdown: true },
  { label: "About Us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(categories[0]?.slug || "");
  const totalItems = useCartStore((s) => s.totalItems());
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [topBarHidden, setTopBarHidden] = useState(false);
  const settings = useSiteSettingsStore((s) => s.settings);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 24) {
        setTopBarHidden(false);
      } else if (currentScrollY > lastScrollY + 4) {
        setTopBarHidden(true);
      } else if (currentScrollY < lastScrollY - 4) {
        setTopBarHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setMobileSearchQuery("");
      setSearchOpen(false);
    }
  };

  const openMega = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const activeCat = categories.find((c) => c.slug === hoveredCat) || categories[0];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={`overflow-hidden bg-[#F97316] text-[#0B1F3A] transition-[max-height,opacity] duration-300 ease-out ${topBarHidden ? "max-h-0 opacity-0" : "max-h-9 opacity-100"}`}>
        <div className="container flex h-8 items-center justify-between gap-3 text-[10px] font-medium sm:text-xs">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-1.5 transition hover:text-black"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate sm:hidden">Visakhapatnam, Andhra Pradesh</span>
            <span className="hidden truncate sm:inline">{settings.address}</span>
          </a>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex shrink-0 items-center gap-1.5 font-semibold transition hover:text-black">
            <Phone className="h-3.5 w-3.5" />
            <span>{settings.phone}</span>
          </a>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-white shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)]">
        <div className="container flex h-[65px] items-center justify-between md:h-[78px]">
          {/* Logo */}
          <Link to="/" aria-label="WaterFilterStore home" className="group shrink-0">
            <img
              src="/images/water-filter-store-logo.jpeg"
              alt="WaterFilterStore — Get everything about water at one Click"
              className="h-12 w-[88px] rounded-xl bg-white object-contain px-1 shadow-sm transition-shadow group-hover:shadow-md lg:h-[72px] lg:w-[140px]"
              width="140"
              height="72"
              fetchPriority="high"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <span
                key={link.to}
                className="flex items-center"
                onMouseEnter={link.hasDropdown ? openMega : undefined}
                onMouseLeave={link.hasDropdown ? closeMega : undefined}
              >
                <Link
                  to={link.to}
                  className="relative flex items-center gap-1 rounded-lg px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-slate-100"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3 w-3 opacity-60" />}
                </Link>
              </span>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 transition-colors focus-within:border-slate-400 md:flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 bg-transparent text-sm text-black outline-none placeholder:text-slate-500 lg:w-40"
              />
              <button type="submit" aria-label="Search products" className="-mr-2 flex min-h-6 min-w-6 items-center justify-center text-black"><Search className="h-4 w-4" /></button>
            </form>
            <button
              type="button"
              onClick={() => openWhatsAppWithTracking("Mobile Header CTA", "Hi! I want to order a water purifier. Please help me choose the right model.")}
              className="mr-0.5 inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#34D399]/30 bg-[#087B55] px-3.5 text-xs font-bold text-white shadow-[0_6px_16px_-8px_rgba(16,185,129,0.9)] transition-all hover:bg-[#066848] active:scale-[0.98] md:hidden"
              aria-label="Order on WhatsApp"
            >
              <img src="/images/whatsapp-logo.svg" alt="" aria-hidden="true" className="h-[18px] w-[18px] shrink-0 brightness-0 invert" />
              <span className="hidden min-[360px]:inline">Order Now</span>
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center bg-transparent text-black transition-colors hover:text-slate-600 md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/admin" aria-label="Admin account" className="hidden rounded-lg p-2.5 text-black transition-colors hover:bg-slate-100 md:block">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ""}`} className="relative hidden rounded-lg p-2.5 text-black transition-colors hover:bg-slate-100 md:block">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px] shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-black transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MEGA DROPDOWN ===== */}
      {megaOpen && (
        <div
          className="hidden lg:block absolute left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl animate-fade-in supports-[backdrop-filter]:bg-background/80"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="container py-6">
            <div className="flex gap-0">
              {/* Left: category list */}
              <div className="w-64 border-r border-border pr-4 space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    onMouseEnter={() => setHoveredCat(cat.slug)}
                    onClick={() => setMegaOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      hoveredCat === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t border-border">
                  <Link
                    to="/products"
                    onClick={() => setMegaOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary hover:underline"
                  >
                    View All Products
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right: image + description */}
              <div className="flex-1 pl-8 flex gap-8 items-start">
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {activeCat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {activeCat.description}
                  </p>
                  <Link
                    to={`/products?category=${activeCat.slug}`}
                    onClick={() => setMegaOpen(false)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Explore {activeCat.name}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="w-64 h-48 rounded-xl overflow-hidden bg-secondary shrink-0">
                  <img
                    src={categoryImages[activeCat.slug] || megaRo}
                    alt={activeCat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={256}
                    height={192}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile search */}
      {searchOpen && (
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(mobileSearchQuery); }} className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-2">
            <input
              type="text"
              placeholder="Type to search"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-black outline-none placeholder:text-slate-500"
              autoFocus
            />
            <button type="submit" aria-label="Search products" className="flex min-h-8 min-w-8 items-center justify-center text-black"><Search className="h-4 w-4" /></button>
          </div>
        </form>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-sm animate-fade-in overflow-y-auto transition-[top] duration-300"
          style={{ top: topBarHidden ? 72 : 104 }}
        >
          <nav className="container flex flex-col py-4 gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-foreground hover:text-accent border-b border-border/50 transition-colors"
              >
                {link.label}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}

            {/* Categories */}
            <div className="mt-4 px-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Shop by Category
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 text-sm text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 px-4 space-y-3">
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0B1E36] text-primary-foreground rounded-lg text-center font-medium hover:bg-[#0B1E36]/90 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              <button
                type="button"
                onClick={() => openWhatsAppWithTracking("Header Mobile Menu", "Hi! I need help choosing a water purifier.")}
                className="w-full py-3 px-4 bg-whatsapp text-whatsapp-foreground rounded-lg text-center font-medium"
              >
                WhatsApp Us - {settings.phone}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
