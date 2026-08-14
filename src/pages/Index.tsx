import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Shield, Droplets, Clock, Award, Plus, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useProductStore } from "@/stores/productStore";
import ProductCard from "@/components/products/ProductCard";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import productRange from "@/assets/product-range.jpg";
import bgCta from "@/assets/bg-cta.jpg";

const heroSlide = {
  image: heroSlide1,
  mobileImage: heroSlide1,
  title: "Advanced Water Purification",
  subtitle: "RO + UV + UF Technology",
  cta: "Explore Products",
  link: "/products",
};

const trustBadges = [
  "Free Delivery",
  "EMI Options Available",
  "Free Installation",
  "Trusted by 10,000+",
  "ISI Certified",
  "2 Year Warranty",
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Visakhapatnam",
    image: "/images/testimonials/rajesh-kumar.webp",
    text: "Excellent water purifier! The whole family is happy with the taste and quality of water. Great after-sales service too. The installation was done on the same day.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Hyderabad",
    image: "/images/testimonials/priya-sharma.webp",
    text: "Very professional installation and the purifier works perfectly. The alkaline feature is amazing for health. Highly recommend WaterFilterStore!",
    rating: 5,
  },
  {
    name: "Suresh Reddy",
    location: "Vijayawada",
    image: "/images/testimonials/suresh-reddy.webp",
    text: "Best investment for our home. Water quality improved dramatically. The service team is very responsive and helpful. Highly recommend!",
    rating: 4,
  },
];

const faqs = [
  {
    category: "selection",
    q: "Why do I need a water purifier?",
    a: "Tap water can have impurities like bacteria, viruses, chemicals, or heavy metals. A purifier ensures your water is clean and safe for drinking.",
  },
  {
    category: "selection",
    q: "What are the benefits of WaterFilterStore water purifiers?",
    a: "WaterFilterStore water purifiers remove impurities from tap water, improve water quality, and ensure your family drinks safe and healthy water with essential minerals retained.",
  },
  {
    category: "installation",
    q: "Can I install the purifier myself?",
    a: "Professional installation is recommended to ensure it works perfectly. WaterFilterStore offers free expert installation services with every purchase.",
  },
  {
    category: "water-sources",
    q: "Is the purifier suitable for all water sources?",
    a: "WaterFilterStore offers a range of purifiers suitable for all water sources like municipal water, bore well, or tankers. Our products handle various impurities ensuring clean and safe drinking water.",
  },
  {
    category: "support",
    q: "Does WaterFilterStore offer customer support?",
    a: "Absolutely! WaterFilterStore provides excellent after-sales support, including installation, servicing, and troubleshooting with dedicated customer service.",
  },
];

const faqCategories = [
  { value: "all", label: "General Questions" },
  { value: "selection", label: "Product Selection" },
  { value: "installation", label: "Installation" },
  { value: "water-sources", label: "Water Sources" },
  { value: "support", label: "Service & Support" },
];

export default function Index() {
  const products = useProductStore((s) => s.products);
  const settings = useSiteSettingsStore((s) => s.settings);
  const featured = products.slice(0, 4);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState("all");
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi>();
  const [testimonialAutoplay, setTestimonialAutoplay] = useState(true);
  const visibleFaqs = faqCategory === "all" ? faqs : faqs.filter((faq) => faq.category === faqCategory);

  useEffect(() => {
    if (!testimonialApi || !testimonialAutoplay) return;

    const autoplay = window.setInterval(() => testimonialApi.scrollNext(), 4500);
    return () => window.clearInterval(autoplay);
  }, [testimonialApi, testimonialAutoplay]);

  return (
    <Layout>
      <SEO
        title="Water Purifiers in Visakhapatnam"
        description="WaterFilterStore offers RO, UV, UF and alkaline water purifiers for homes and businesses in Visakhapatnam, Andhra Pradesh, with free installation and competitive prices."
        keywords="water purifier Visakhapatnam, RO purifier Visakhapatnam, water filter Gajuwaka, alkaline water purifier Andhra Pradesh, commercial RO plant Vizag, WaterFilterStore"
      />
      {/* Hero */}
      <section className="relative h-[350px] md:h-[420px] lg:h-[480px] overflow-hidden">
        <picture>
          <source media="(max-width: 767px)" srcSet={settings.heroImages.homeSlide1 || heroSlide.mobileImage} />
          <img
            src={settings.heroImages.homeSlide1 || heroSlide.image}
            alt={heroSlide.title}
            width={1920}
            height={800}
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-slate-950/10 md:bg-gradient-to-t md:from-foreground/80 md:via-foreground/35 md:to-foreground/10" />
        <div className="absolute inset-0 flex items-end pb-14 md:pb-16 lg:pb-20">
          <div className="container">
            <div className="max-w-xl">
              <span className="mb-3 inline-block rounded-full bg-accent/90 px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-wider text-accent-foreground md:text-xs">
                {heroSlide.subtitle}
              </span>
              <h1 className="mb-4 font-heading text-2xl font-extrabold leading-[1.15] text-primary-foreground drop-shadow-lg md:text-4xl lg:text-5xl">
                {heroSlide.title}
              </h1>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#FFD21C] px-8 font-heading font-semibold text-[#111827] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C400] hover:text-[#111827] hover:shadow-xl"
              >
                <Link to={heroSlide.link}>
                  {heroSlide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Trust Marquee */}
      <section className="py-3.5 bg-navy overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...trustBadges, ...trustBadges].map((badge, i) => (
            <span key={i} className="inline-flex items-center gap-2.5 mx-8 text-primary-foreground/90 text-sm font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {badge}
            </span>
            ))}
        </div>
      </section>

      {/* Solution Categories */}
      <section className="bg-background py-6 md:py-8">
        <div className="container relative mx-3 w-auto overflow-hidden rounded-[28px] border border-white/20 px-1 py-7 shadow-[0_24px_65px_-32px_rgba(15,23,42,0.7)] md:mx-auto md:w-full md:px-8 md:py-10">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/our-solutions-background-800.jpg" />
            <img
              src="/images/our-solutions-background-1600.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              width="1600"
              height="1067"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-[#061224]/55 backdrop-blur-[1px]" />
          <div className="relative z-10 mb-7 text-center">
            <p className="mx-auto mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">Our Solutions</p>
            <h2 className="hidden font-heading text-2xl font-bold text-white md:block md:text-4xl">
              Find Your Perfect Fit
            </h2>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {settings.homepageSolutions.map((cat) => (
              <Link
                key={cat.title}
                to={cat.link}
                className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/95 shadow-[0_16px_38px_-22px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-white/80 hover:shadow-[0_22px_50px_-22px_rgba(0,0,0,0.7)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {cat.desc}
                  </p>
                  <span className="text-accent font-heading font-semibold text-xs inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Range Section */}
      <section className="relative hidden overflow-hidden border-y border-sky-100 bg-[radial-gradient(circle_at_12%_18%,rgba(14,165,233,0.14),transparent_32%),radial-gradient(circle_at_88%_82%,rgba(6,182,212,0.12),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef8fc_52%,#f7fcfb_100%)] py-8 md:block md:py-10">
        <div className="container">
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_20px_60px_-35px_rgba(8,47,73,0.45)] backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row">
              <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                <p className="text-accent font-heading font-semibold text-sm uppercase tracking-wider mb-3">Our Range</p>
                <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
                  Multiple Options,{" "}
                  <span className="text-accent">One Destination</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                  Choose the right water filter for your home. Our product range is
                  thoughtfully crafted to suit your unique needs.
                </p>
                <div>
                  <Button asChild className="rounded-full bg-accent px-8 font-heading font-semibold text-white hover:bg-accent/90 hover:text-white">
                    <Link to="/products">
                      View Products <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img
                  src={productRange}
                  alt="Range of water purification products"
                  loading="lazy"
                  width={1600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-8 bg-surface">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-7">
            <div>
              <p className="text-accent font-heading font-semibold text-sm uppercase tracking-wider mb-2">Top Picks</p>
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">
                Our Best Sellers
              </h2>
              <p className="text-muted-foreground mt-2 text-sm max-w-md">
                Trusted by thousands of families — our most popular water purifiers
              </p>
            </div>
            <Link to="/products" className="mt-4 md:mt-0">
              <Button variant="outline" className="rounded-full px-6 font-heading font-semibold border-foreground text-foreground hover:bg-foreground hover:text-background text-sm">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 px-5 py-8 shadow-xl sm:px-8 md:px-12 md:py-10">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/our-promise-800.jpg" />
              <img
                src="/images/our-promise-1600.jpg"
                alt=""
                loading="lazy"
                decoding="async"
                width="1600"
                height="740"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-slate-950/60" />

            <div className="relative grid lg:grid-cols-[0.75fr_1.4fr] gap-8 lg:gap-12 items-center">
              <div>
                <p className="mb-3 font-heading text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">Our Promise</p>
                <h2 className="font-heading text-3xl font-bold leading-tight text-white drop-shadow-sm md:text-5xl">Why families choose us.</h2>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
                  Reliable purification, certified quality, and responsive service—delivered with every WaterFilterStore solution.
                </p>
                <Link to="/about" className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-300 hover:text-white hover:underline">
                  Learn about our standards <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: Droplets, title: "99.9% Pure Water", desc: "Advanced RO+UV+UF technology" },
              { icon: Shield, title: "Certified Quality", desc: "ISI & ISO certified products" },
              { icon: Clock, title: "Quick Installation", desc: "Free same-day installation" },
              { icon: Award, title: "Warranty Assured", desc: "Up to 2 years warranty" },
            ].map((b, i) => (
              <div
                key={i}
                className="group rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F7FF] transition-colors group-hover:bg-[#082456] sm:h-12 sm:w-12">
                  <b.icon className="h-5 w-5 text-[#0B6D9A] transition-colors group-hover:text-white sm:h-6 sm:w-6" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-foreground mb-1.5 leading-tight">
                  {b.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="relative max-w-6xl mx-auto overflow-hidden border border-accent/10 bg-gradient-to-br from-[#F9FCFF] via-[#F5FBFC] to-[#FFF8F7] px-5 py-8 sm:px-8 md:px-12 md:py-10 shadow-sm">
            <span className="absolute left-8 top-16 h-3 w-3 rounded-full bg-accent/25" />
            <span className="absolute right-16 top-20 h-4 w-4 rounded-full bg-cyan-300/30" />
            <span className="absolute left-1/3 top-7 h-2 w-2 rounded-full bg-rose-300/40" />
            <span className="absolute right-1/4 bottom-9 text-accent/25 text-xl">+</span>

            <div className="relative text-center max-w-2xl mx-auto mb-6 md:mb-8">
              <p className="text-accent font-heading font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Help Center</p>
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">Frequently Asked Questions</h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-3">
                Our platform is built to help you choose the right water solution. Ask freely—our experts are ready to help.
              </p>
            </div>

            <div className="relative grid grid-cols-[0.72fr_1.45fr] gap-2 sm:gap-5 md:grid-cols-[0.8fr_1.6fr] md:gap-8 items-start">
              <div className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => { setFaqCategory(category.value); setOpenFaq(null); }}
                    className={`w-full flex items-center justify-between gap-1 px-2 py-2.5 sm:px-4 sm:py-3 text-left text-[9px] sm:text-xs md:text-sm leading-tight transition-all ${faqCategory === category.value ? "bg-white text-foreground font-semibold shadow-sm border border-border" : "bg-white/50 text-muted-foreground hover:bg-white border border-transparent"}`}
                  >
                    <span>{category.label}</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="divide-y divide-border/80">
                {visibleFaqs.map((faq, i) => (
                  <div key={faq.q} className={`${openFaq === i ? "bg-white shadow-sm" : "bg-white/35"}`}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-2 sm:gap-4 px-2.5 py-3 sm:px-4 sm:py-4 md:px-5 text-left">
                      <span className="font-heading font-medium text-[9px] sm:text-xs md:text-sm text-foreground leading-snug">{faq.q}</span>
                      <Plus className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-45 text-accent" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-2.5 sm:px-4 md:px-5 pb-3 sm:pb-4 text-[8px] sm:text-[11px] md:text-xs text-muted-foreground leading-relaxed animate-fade-in">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 text-center">
              <Link to="/contact" className="text-xs font-semibold text-accent hover:underline">Still need help? Contact our experts →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-5 md:py-8">
        <div className="container">
          <div className="mb-4 text-center md:mb-7">
            <p className="mb-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-accent md:mb-2 md:text-sm">Customer Love</p>
            <h2 className="font-heading text-xl font-bold text-foreground md:text-4xl">
              What Our Customers Say
            </h2>
          </div>
          <Carousel
            setApi={setTestimonialApi}
            opts={{ align: "start", loop: true }}
            onPointerDown={() => setTestimonialAutoplay(false)}
            className="mx-auto max-w-5xl"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="basis-[88%] pl-2 md:basis-1/2 md:pl-4">
                  <div className="relative h-full rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent/20 hover:shadow-card-hover md:rounded-2xl md:p-8">
                    <div className="mb-2 flex gap-0.5 md:mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${
                            j < t.rating
                              ? "fill-accent text-accent"
                              : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-xs leading-relaxed text-foreground md:mb-6 md:text-sm">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-2.5 border-t border-border pt-3 md:gap-3 md:pt-4">
                      <img
                        src={t.image}
                        alt={`${t.name}, WaterFilterStore customer`}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-border md:h-10 md:w-10"
                      />
                      <div>
                        <p className="font-heading font-semibold text-sm text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 relative text-primary-foreground overflow-hidden">
        <img src={bgCta} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container text-center relative z-10">
          <h2 className="font-heading font-bold text-2xl md:text-4xl mb-3">
            Get Your Perfect Water Purifier Today
          </h2>
          <p className="opacity-70 mb-8 max-w-xl mx-auto text-sm">
            Free delivery & installation. Talk to our experts on WhatsApp for
            personalized recommendations.
          </p>
          <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-2 sm:gap-4">
            <Button
              type="button"
              size="lg"
              onClick={() =>
                openWhatsAppWithTracking("Home CTA", "Hi! I need help choosing a water purifier.")
              }
              className="h-11 w-full rounded-full bg-[#047857] px-2 font-heading text-[11px] font-semibold text-white hover:bg-[#036747] sm:h-12 sm:px-6 sm:text-sm"
            >
              <img src="/images/whatsapp-logo.svg" alt="" aria-hidden="true" className="mr-1.5 h-4 w-4 shrink-0 brightness-0 invert sm:mr-2 sm:h-5 sm:w-5" />
              <span className="truncate">Chat on WhatsApp</span>
            </Button>
            <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 w-full rounded-full border-[#FFD21C] bg-[#FFD21C] px-2 font-heading text-[11px] font-bold text-[#111827] hover:border-[#F2C400] hover:bg-[#F2C400] hover:text-[#111827] sm:h-12 sm:px-6 sm:text-sm"
              >
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}><Phone className="mr-1.5 h-4 w-4 shrink-0 sm:mr-2 sm:h-5 sm:w-5" /><span className="truncate">Call {settings.phone}</span></a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
