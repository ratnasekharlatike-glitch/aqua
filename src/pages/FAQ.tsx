import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import bgHero from "@/assets/bg-hero-dark.jpg";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import SEO from "@/components/SEO";

const faqCategories = [
  {
    name: "Water Purification",
    faqs: [
      { q: "What is the difference between RO, UV, and UF purification?", a: "RO (Reverse Osmosis) removes dissolved impurities and heavy metals, making it ideal for high TDS water. UV (Ultraviolet) kills bacteria and viruses but doesn't remove dissolved solids. UF (Ultrafiltration) removes bacteria and larger particles without electricity. Many modern purifiers combine all three for comprehensive purification." },
      { q: "How do I know which purifier is right for my home?", a: "It depends on your water source and TDS level. For municipal/corporation water (TDS < 200), an industrial water solution is sufficient. For borewell or tanker water (TDS 200-2000), an RO purifier is recommended. For very high TDS water, an RO+UV+UF combination is ideal. Contact us for a free water quality assessment!" },
      { q: "What is TDS and why does it matter?", a: "TDS (Total Dissolved Solids) measures the concentration of dissolved substances in water, including minerals, salts, and metals. While some minerals are beneficial, high TDS water can taste bad and may contain harmful substances. The ideal TDS for drinking water is 50-150 ppm." },
      { q: "Is RO water safe for babies?", a: "Yes, RO purified water is safe for babies. It removes harmful contaminants while some models retain essential minerals. Always ensure your purifier has a mineralizer or TDS controller to maintain healthy mineral levels." },
    ],
  },
  {
    name: "Products & Installation",
    faqs: [
      { q: "Do you offer free installation?", a: "Yes! We provide free installation for all water purifiers purchased from our store. Our trained technicians will install the unit within 24-48 hours of purchase in Visakhapatnam. For other cities, installation is scheduled within 3-5 business days." },
      { q: "How long does installation take?", a: "Standard installation takes 30-60 minutes. Our technician will test the water quality, install the purifier, and demonstrate how to use it. They'll also explain the maintenance schedule." },
      { q: "Do I need a separate tap for the purifier?", a: "Most RO purifiers come with their own dedicated faucet. We'll drill a small hole in your kitchen sink or countertop during installation. If you prefer not to drill, wall-mounted options are also available." },
      { q: "Can I relocate my purifier to a different room?", a: "Yes, our technicians can help relocate your purifier. Contact us to schedule a relocation service. Additional plumbing charges may apply depending on the new location." },
    ],
  },
  {
    name: "Service & Maintenance",
    faqs: [
      { q: "How often should I service my water purifier?", a: "We recommend servicing every 6 months. This includes filter replacement, sanitization, and performance testing. Regular maintenance ensures your purifier works efficiently and provides safe water." },
      { q: "What does the annual maintenance contract (AMC) include?", a: "Our AMC includes 2 scheduled visits per year, filter and membrane replacements, complete sanitization, water quality testing, and priority support. AMC customers get 15% discount on spare parts." },
      { q: "How do I schedule a service visit?", a: "You can schedule a service visit by calling us at +91 9985851237, messaging on WhatsApp, or filling out the service request form on our Contact page. We typically respond within 2 hours during business hours." },
      { q: "What is the cost of filter replacement?", a: "Filter replacement costs vary by model. Pre-filters cost ₹200-500, carbon filters ₹400-800, and RO membranes ₹1,500-3,000. We use only genuine parts to ensure optimal performance. AMC customers get discounted rates." },
    ],
  },
  {
    name: "Warranty & Support",
    faqs: [
      { q: "What does the warranty cover?", a: "Our comprehensive warranty covers manufacturing defects, motor/pump failures, and electrical issues. It does not cover consumables like filters, cartridges, and membranes, which need periodic replacement." },
      { q: "How do I claim warranty?", a: "To claim warranty, contact us with your purchase details and product serial number. Our team will verify the warranty status and arrange for inspection or repair within 48 hours. Keep your original invoice for warranty claims." },
      { q: "What is the cost of annual maintenance?", a: "Annual maintenance costs vary by model. For RO+UV systems, it typically ranges from ₹2,000 to ₹4,000 including filters and labor. We offer annual maintenance contracts (AMC) at discounted rates." },
      { q: "Do you provide emergency repair services?", a: "Yes, we provide emergency repair services for critical issues. Contact our helpline at +91 9985851237 for urgent support. Emergency visits are available within 4-6 hours in Visakhapatnam." },
    ],
  },
  {
    name: "Ordering & Delivery",
    faqs: [
      { q: "How do I place an order?", a: "You can order through our website by adding products to your cart and completing the checkout via WhatsApp. Alternatively, call us at +91 9985851237 or send a WhatsApp message directly. Our team will confirm your order and arrange delivery." },
      { q: "What are the payment options?", a: "We accept UPI, bank transfer, cash on delivery, and EMI options for select products. Payment details will be shared via WhatsApp after order confirmation." },
      { q: "Do you deliver outside Visakhapatnam?", a: "Yes! We deliver across Andhra Pradesh, Telangana, and other states. Delivery within Visakhapatnam is free. For other locations, shipping charges may apply based on distance and product size." },
      { q: "Can I return or exchange a product?", a: "Yes, we offer a 7-day return policy for unopened products in original packaging. For exchanges, contact us within 15 days of purchase. Custom or installed products may have different terms — please check at the time of purchase." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border transition-colors ${open ? "bg-card border-accent/30 shadow-card" : "bg-card border-border"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left p-5"
      >
        <span className="font-heading font-medium text-sm text-foreground pr-4">{q}</span>
        <span className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all ${open ? "bg-accent text-accent-foreground rotate-180" : "bg-secondary text-muted-foreground"}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const settings = useSiteSettingsStore((s) => s.settings);
  return (
    <Layout>
      <SEO
        title="Water Purifier FAQs | Products, Installation & Service"
        description="Find answers about RO, UV and UF water purifiers, TDS levels, free installation, filter replacement, warranty, maintenance and delivery in Visakhapatnam."
        keywords="water purifier FAQ, RO purifier installation Visakhapatnam, water purifier service cost, RO filter replacement, purifier warranty, TDS questions"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqCategories.flatMap((category) => category.faqs).map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <section className="relative text-primary-foreground py-10 md:py-14 overflow-hidden">
        <img src={settings.heroImages.faq || bgHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container text-center relative z-10">
          <nav className="text-sm mb-4 opacity-60 font-medium">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span className="mx-2">/</span>
            <span>FAQ</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-3 opacity-70 text-sm md:text-base max-w-xl mx-auto">Find answers to common questions about our products and services</p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container">
          {faqCategories.map((cat, i) => (
            <div key={i} className="mb-12 last:mb-0">
              <div className="text-center mb-6">
                <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground">{cat.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
                {cat.faqs.map((faq, j) => (
                  <FAQItem key={j} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}

          <div className="bg-navy rounded-2xl p-8 md:p-10 text-center mt-14 text-primary-foreground max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-xl mb-2">Still Have Questions?</h3>
            <p className="opacity-70 mb-6 text-sm">Our experts are here to help. Reach out anytime!</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                onClick={() => openWhatsAppWithTracking("FAQ CTA", "Hi! I have a question about WaterFilterStore products.")}
                className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-heading font-semibold rounded-full px-6"
              >
                WhatsApp Us
              </Button>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-heading font-semibold"
                >
                  Contact Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
