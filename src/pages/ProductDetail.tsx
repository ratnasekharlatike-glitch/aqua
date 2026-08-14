import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  ChevronRight,
  CircleCheck,
  Droplets,
  PackageCheck,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";

const fallbackProductImage = "/images/premium-ro-purifier.png";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const products = useProductStore((s) => s.products);
  const product = products.find((p) => p.slug === (slug || ""));
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  const gallery = useMemo(() => {
    const savedImages = product?.images.filter((image) => image && image !== "/placeholder.svg") || [];
    return savedImages.length > 0 ? savedImages : [fallbackProductImage];
  }, [product]);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">Product Not Found</h1>
          <Link to="/products"><Button className="mt-4">Browse Products</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleWhatsAppOrder = () => openWhatsAppWithTracking(
    `Product Detail: ${product.name}`,
    `Hi! I'd like to order ${product.name} — ₹${product.price.selling.toLocaleString("en-IN")}. Please share delivery and installation details.`,
  );

  const tabs = ["Overview", "Specifications", "Installation & Warranty", `Reviews (${product.reviewCount})`];
  const productUrl = `https://waterfilterstore.in/products/${product.slug}`;
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: gallery.map((image) => image.startsWith("/") ? `https://waterfilterstore.in${image}` : image),
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: product.name.startsWith("Yiwin") ? "Yiwin" : "WaterFilterStore",
    },
    category: product.category.replace(/-/g, " "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price.selling,
      priceValidUntil: "2027-12-31",
      availability: `https://schema.org/${product.stock === "out_of_stock" ? "OutOfStock" : product.stock === "low_stock" ? "LimitedAvailability" : "InStock"}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "WaterFilterStore",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
      },
    },
  };

  return (
    <Layout>
      <SEO
        title={`${product.name} in Visakhapatnam`}
        description={`${product.description} Buy ${product.name} from WaterFilterStore in Visakhapatnam with free delivery and installation.`}
        type="product"
        keywords={`${product.name}, ${product.category.replace(/-/g, " ")} Visakhapatnam, water purifier in Visakhapatnam, RO water purifier Gajuwaka, water filter Andhra Pradesh, buy water purifier online, commercial RO plant Visakhapatnam`}
        image={gallery[0]}
        structuredData={productStructuredData}
      />
      <main className="bg-white pb-24 lg:pb-0">
        <div className="border-b border-slate-200">
          <div className="container flex items-center gap-1 overflow-hidden py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
            <Link to="/products" className="shrink-0 hover:text-primary">RO Purifiers</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">RO + UV + UF Purifiers</span>
          </div>
        </div>

        <section className="product-detail-grid container grid gap-6 py-5 lg:gap-6 lg:py-6 xl:gap-8">
          <div className="flex min-w-0 flex-col-reverse gap-3 sm:flex-row">
            <div className="flex gap-2 overflow-x-auto sm:w-[72px] sm:flex-col sm:overflow-visible">
              {gallery.map((image, index) => (
                <button
                  key={`${image.slice(0, 60)}-${index}`}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white transition sm:h-[72px] sm:w-[72px] ${activeImage === index ? "border-primary ring-1 ring-primary" : "border-slate-200 hover:border-slate-400"}`}
                >
                  <img src={image} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>

            <div className="product-gallery-stage relative h-[360px] min-w-0 overflow-hidden bg-[#f7f7f6] sm:h-[510px] sm:flex-1 lg:h-[500px]">
              <img
                src={gallery[activeImage] || gallery[0]}
                alt={product.name}
                className="product-main-image absolute inset-0 h-full w-full object-contain p-3 transition-all duration-300 sm:p-5"
              />
            </div>
          </div>

          <div className="min-w-0 lg:pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">{product.category.replace(/-/g, " ")}</p>
            <h1 className="mt-2 max-w-2xl font-heading text-[26px] font-bold leading-[1.18] text-[#082456] sm:text-3xl lg:text-[30px]">
              {product.name}
            </h1>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{product.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-[#f5a623]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-current" : "text-slate-200"}`} />)}
              </div>
              <span className="font-medium text-slate-700">{product.rating}</span>
              <span className="h-4 w-px bg-slate-300" />
              <button type="button" onClick={() => setActiveTab(`Reviews (${product.reviewCount})`)} className="font-medium text-primary hover:underline">{product.reviewCount} reviews</button>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-3xl font-bold text-slate-950 sm:text-[36px]">₹{product.price.selling.toLocaleString("en-IN")}</span>
              <span className="text-lg text-slate-500 line-through">₹{product.price.original.toLocaleString("en-IN")}</span>
              <span className="text-lg font-bold text-emerald-600">{product.price.discount}% OFF</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600"><CircleCheck className="h-4 w-4" /> In stock</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Ships in 24 hours</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-y border-slate-200 py-5 lg:mt-4 lg:py-3.5">
              {[
                [ShieldCheck, "100% Genuine", "Brand warranty"],
                [Wrench, "Free Installation", "Across the city"],
                [PackageCheck, product.warranty, "On product"],
              ].map(([Icon, title, detail]) => (
                <div key={String(title)} className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start">
                  <Icon className="h-7 w-7 shrink-0 text-[#063f97]" />
                  <div className="min-w-0"><p className="text-xs font-bold text-[#082456] sm:text-sm">{String(title)}</p><p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{String(detail)}</p></div>
                </div>
              ))}
            </div>

            <div className="mt-6 hidden sm:block lg:mt-4">
              <Button onClick={handleWhatsAppOrder} className="h-[68px] w-full rounded-full bg-[#047857] text-base font-bold hover:bg-[#036747] lg:h-14">
                <img src="/images/whatsapp-logo.svg" alt="" aria-hidden="true" className="mr-3 h-6 w-6 brightness-0 invert" /><span><span className="block">Order on WhatsApp</span><span className="block text-xs font-normal text-white/85">Talk to a water expert</span></span>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.12fr_0.88fr] lg:mt-4 lg:gap-3">
              <div className="rounded-lg bg-[#f1f7fb] p-4 lg:p-3">
                <p className="text-sm font-semibold text-slate-800">Check delivery & installation at your location</p>
                <div className="mt-3 flex gap-2">
                  <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={pincode} onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setDeliveryChecked(false); }} placeholder="Enter your pincode" className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
                  <Button onClick={() => setDeliveryChecked(pincode.length === 6)} className="h-11 rounded-md bg-[#063f97] px-5">Check</Button>
                </div>
                {deliveryChecked ? <p className="mt-3 text-sm font-medium text-emerald-600">Delivery available · Free installation included</p> : <div className="mt-3 flex items-end justify-between"><span className="text-xs text-slate-500">Usually delivered in</span><span className="font-bold text-emerald-600">2–4 working days</span></div>}
              </div>
              <div className="py-1">
                <h2 className="font-heading font-bold text-[#082456]">Why this purifier?</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {product.features.slice(0, 5).map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#063f97]" /><span>{feature}</span></li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <nav className="sticky top-0 z-20 border-y border-slate-200 bg-white/95 backdrop-blur">
          <div className="container flex overflow-x-auto">
            {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`relative min-w-max flex-1 px-5 py-4 text-sm font-semibold transition ${activeTab === tab ? "text-[#063f97]" : "text-slate-500 hover:text-slate-800"}`}>{tab}{activeTab === tab && <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#063f97]" />}</button>)}
          </div>
        </nav>

        <section className="container py-9 lg:py-12">
          {activeTab === "Overview" && (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.55fr] lg:divide-x lg:divide-slate-200">
              <div className="lg:pr-12"><h2 className="font-heading text-2xl font-bold text-[#082456]">Pure water. Better every day.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{product.description}</p></div>
              <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:pl-12">
                {[[Droplets, "7-Stage Purification", "RO + UV + UF + TDS"], [ShieldCheck, "100% Safe Water", "Removes contaminants"], [SlidersHorizontal, "TDS Controller", "Taste adjusted for you"], [Sparkles, "Retains Goodness", "Essential minerals intact"]].map(([Icon, title, detail]) => <div key={String(title)} className="px-2 text-center"><Icon className="mx-auto h-10 w-10 text-[#063f97]" /><p className="mt-4 text-sm font-bold text-[#082456]">{String(title)}</p><p className="mt-1 text-xs text-slate-500">{String(detail)}</p></div>)}
              </div>
            </div>
          )}
          {activeTab === "Specifications" && <div className="mx-auto max-w-4xl"><h2 className="font-heading text-2xl font-bold text-[#082456]">Technical specifications</h2><div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="grid grid-cols-2 gap-4 py-3 text-sm"><span className="font-semibold text-slate-700">{key}</span><span className="text-slate-600">{value}</span></div>)}</div></div>}
          {activeTab === "Installation & Warranty" && <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2"><div className="border-l-4 border-primary pl-5"><h2 className="font-heading text-xl font-bold text-[#082456]">Free professional installation</h2><p className="mt-2 text-sm leading-6 text-slate-600">Our service expert will install and demonstrate your purifier at no additional charge.</p></div><div className="border-l-4 border-primary pl-5"><h2 className="font-heading text-xl font-bold text-[#082456]">{product.warranty}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Comprehensive support for your product with responsive service assistance.</p></div></div>}
          {activeTab.startsWith("Reviews") && <div className="mx-auto max-w-4xl"><div className="flex items-end gap-4"><span className="text-5xl font-bold text-[#082456]">{product.rating}</span><div><div className="flex text-[#f5a623]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}</div><p className="mt-1 text-sm text-slate-500">Based on {product.reviewCount} verified reviews</p></div></div></div>}
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_24px_rgba(15,23,42,0.10)] sm:hidden">
          <Button onClick={handleWhatsAppOrder} className="h-12 w-full rounded-full bg-[#047857] font-bold hover:bg-[#036747]"><img src="/images/whatsapp-logo.svg" alt="" aria-hidden="true" className="mr-2 h-5 w-5 brightness-0 invert" /> Order on WhatsApp</Button>
        </div>
      </main>
    </Layout>
  );
}
