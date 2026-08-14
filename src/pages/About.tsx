import { Link } from "react-router-dom";
import { Target, Eye, Users, Droplets, Shield, Clock, ArrowRight, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import bgHero from "@/assets/bg-hero-dark.jpg";
import bgCta from "@/assets/bg-cta.jpg";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";

const milestones = [
  { year: "2006", title: "Founded", desc: "Started with a mission to provide clean water to every household" },
  { year: "2018", title: "1,000+ Installations", desc: "Crossed 1,000 water purifier installations across AP" },
  { year: "2020", title: "Commercial Expansion", desc: "Launched commercial RO plant division for businesses" },
  { year: "2024", title: "10,000+ Customers", desc: "Trusted by over 10,000 families and businesses" },
];

const values = [
  { icon: Droplets, title: "Purity First", desc: "Every product meets the highest standards of water purification." },
  { icon: Shield, title: "Trust & Transparency", desc: "Honest pricing, genuine products, and reliable service." },
  { icon: Users, title: "Customer Centric", desc: "Your satisfaction drives everything we do." },
  { icon: Clock, title: "Swift Service", desc: "Same-day installation and responsive after-sales support." },
];

const trustBenefits = [
  { icon: Shield, title: "ISI & ISO Certified", desc: "Products that meet trusted quality standards" },
  { icon: Package, title: "Free Installation & Delivery", desc: "A smooth experience from purchase to setup" },
  { icon: Clock, title: "24/7 Customer Support", desc: "Reliable help whenever you need it" },
  { icon: CheckCircle, title: "1 Year Warranty", desc: "Warranty coverage on every product" },
];

export default function About() {
  const settings = useSiteSettingsStore((s) => s.settings);
  return (
    <Layout>
      <SEO title="About WaterFilterStore | Water Purification Experts" description="Learn about WaterFilterStore, a Visakhapatnam water purification company providing certified home, commercial and industrial water solutions, installation and support since 2006." keywords="about WaterFilterStore, water purification company Visakhapatnam, RO plant manufacturer Andhra Pradesh, water treatment experts Gajuwaka, certified water purifier dealer" />
      <div className="[--accent:221_75%_47%] [--navy:222_50%_11%] [--surface:214_33%_97%]">
      {/* Hero */}
      <section className="relative text-primary-foreground py-10 md:py-14 overflow-hidden">
        <img src={settings.heroImages.about || bgHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container relative z-10">
          <nav className="text-sm mb-6 opacity-60 font-medium">
            <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
            <span className="mx-2">/</span>
            <span>About Us</span>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-accent font-heading font-semibold text-sm uppercase tracking-wider mb-3">Who We Are</p>
            <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl leading-tight mb-5">
              Pure Water, <span className="text-accent">Healthy Lives</span>
            </h1>
            <p className="opacity-80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Dedicated to providing clean, safe, and healthy water solutions for homes and businesses across India since 2006.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-14 md:py-20 bg-[#F8FAFD]">
        <div className="container">
          <div className="max-w-6xl mx-auto overflow-hidden rounded-md border border-slate-200 bg-card shadow-sm">
            <div className="grid lg:grid-cols-[1.45fr_0.85fr]">
              <div className="p-6 sm:p-9 lg:p-12">
                <p className="text-accent font-heading font-bold text-xs uppercase tracking-[0.2em] mb-4">Who We Are</p>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground leading-tight mb-5">
                  Pure water. Trusted expertise. <span className="text-accent">Since 2006.</span>
                </h2>
                <div className="h-1 w-12 rounded-full bg-accent mb-6" />
                <p className="text-foreground/90 leading-relaxed text-sm sm:text-base mb-5">
                  <strong className="font-heading">WaterFilterStore</strong> is a leading water purification solutions provider based in Visakhapatnam, Andhra Pradesh. We are committed to ensuring every family has access to pure, healthy drinking water.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  From advanced RO+UV+UF home systems to industrial-grade commercial plants, our expert team provides complete support—including consultation, installation, maintenance, and dependable service from start to finish.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 max-w-md">
                  <div className="rounded-md border border-accent/15 bg-accent/5 p-4">
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-accent">20+</p>
                    <p className="text-xs text-muted-foreground mt-1">Years of trust</p>
                  </div>
                  <div className="rounded-md border border-accent/15 bg-accent/5 p-4">
                    <p className="font-heading text-2xl sm:text-3xl font-bold text-accent">10K+</p>
                    <p className="text-xs text-muted-foreground mt-1">Happy customers</p>
                  </div>
                </div>
              </div>
              <div className="bg-navy text-primary-foreground p-6 sm:p-9 lg:p-10">
                <p className="text-accent font-heading font-bold text-xs uppercase tracking-[0.2em] mb-3">Why Choose Us</p>
                <h3 className="font-heading font-bold text-2xl leading-tight mb-7">Confidence with every purchase</h3>
                <div className="divide-y divide-primary-foreground/10">
                  {trustBenefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                      <div className="h-11 w-11 shrink-0 rounded-full bg-accent/15 flex items-center justify-center">
                        <benefit.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm sm:text-base">{benefit.title}</h4>
                        <p className="text-xs text-primary-foreground/65 mt-1 leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 md:py-20 bg-[#F1F5FA] border-y border-slate-200/70">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <p className="text-accent font-heading font-bold text-xs uppercase tracking-[0.2em] mb-3">Our Purpose</p>
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">Driven by purpose. Guided by vision.</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 md:gap-7">
              <article className="group relative overflow-hidden bg-card rounded-md p-7 sm:p-9 md:p-10 border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                <span className="absolute top-5 left-6 font-heading text-6xl font-bold text-accent/10 select-none">01</span>
                <div className="relative flex justify-end mb-7">
                  <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                    <Target className="h-7 w-7 text-accent group-hover:text-accent-foreground" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Our Mission</h3>
                <div className="h-1 w-10 rounded-full bg-accent mb-5" />
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To make clean, safe drinking water accessible and affordable for every household and business through innovative purification technology and exceptional service.
                </p>
              </article>

              <article className="group relative overflow-hidden bg-navy text-primary-foreground rounded-md p-7 sm:p-9 md:p-10 border border-primary-foreground/10 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                <span className="absolute top-5 left-6 font-heading text-6xl font-bold text-primary-foreground/10 select-none">02</span>
                <div className="relative flex justify-end mb-7">
                  <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Eye className="h-7 w-7 text-accent-foreground" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-2xl mb-3">Our Vision</h3>
                <div className="h-1 w-10 rounded-full bg-accent mb-5" />
                <p className="text-primary-foreground/70 leading-relaxed text-sm sm:text-base">
                  To become India's most trusted water purification brand, known for quality products, honest pricing, and unmatched customer care.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-14 md:py-20 bg-[#F8FAFD]">
        <div className="container">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.75fr_1.6fr] gap-7 lg:gap-10 items-stretch">
            <div className="relative overflow-hidden rounded-md bg-navy text-primary-foreground p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10" />
              <div className="relative">
                <p className="text-accent font-heading font-bold text-xs uppercase tracking-[0.2em] mb-4">What Drives Us</p>
                <h2 className="font-heading font-bold text-3xl md:text-4xl leading-tight">Values behind every drop.</h2>
                <p className="text-primary-foreground/65 text-sm leading-relaxed mt-5 max-w-sm">
                  The principles that guide how we choose products, serve customers, and build lasting trust.
                </p>
              </div>
              <div className="relative flex items-center gap-3 mt-10 pt-6 border-t border-primary-foreground/10">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">Pure intentions</p>
                  <p className="text-xs text-primary-foreground/55">Better water. Better lives.</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {values.map((v, i) => (
                <article key={v.title} className="group relative overflow-hidden rounded-md border border-slate-200 bg-card p-6 sm:p-7 hover:-translate-y-1 hover:border-accent/25 hover:shadow-card-hover transition-all duration-300">
                  <span className="absolute right-5 top-4 font-heading text-4xl font-bold text-foreground/5">0{i + 1}</span>
                  <div className="h-12 w-12 rounded-xl bg-accent/10 ring-1 ring-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
                    <v.icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-14 md:py-20 bg-[#F1F5FA] border-y border-slate-200/70">
        <div className="container">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.7fr_1.4fr] border border-border bg-card shadow-sm">
            <div className="bg-navy text-primary-foreground p-7 sm:p-9 lg:p-11">
              <p className="text-accent font-heading font-bold text-xs uppercase tracking-[0.2em] mb-4">Company History</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl leading-tight">Our growth journey</h2>
              <p className="text-sm text-primary-foreground/60 leading-relaxed mt-5">
                Key milestones in building a trusted water-purification company for homes and businesses.
              </p>
              <div className="mt-9 pt-6 border-t border-primary-foreground/10">
                <p className="font-heading text-2xl font-bold text-accent">20+ years</p>
                <p className="text-xs text-primary-foreground/55 mt-1">of water-purification expertise</p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {milestones.map((milestone, i) => (
                <article
                  key={milestone.year}
                  className={`group grid grid-cols-[4.5rem_1fr] sm:grid-cols-[6.5rem_1fr_auto] gap-4 sm:gap-6 items-start p-5 sm:p-7 lg:px-9 transition-colors hover:bg-secondary/30 ${i === milestones.length - 1 ? "bg-accent/[0.04]" : ""}`}
                >
                  <p className={`font-heading text-xl sm:text-2xl font-bold ${i === milestones.length - 1 ? "text-accent" : "text-navy"}`}>
                    {milestone.year}
                  </p>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">{milestone.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5">{milestone.desc}</p>
                  </div>
                  <span className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i === milestones.length - 1 ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#F1F5FA] py-14 md:py-20 border-y border-slate-200/70">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">Our Impact</p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                Trusted performance &amp; experience
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-4">
                Our work is measured by lasting customer trust, proven expertise, and dependable water-purification solutions since 2006.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {settings.aboutStats.map((stat, i) => {
                const displayValue = /years/i.test(stat.label) ? "20+" : stat.value.replace(/[★☆]/g, "");
                return (
                  <article
                    key={`${stat.label}-${i}`}
                    className="flex min-h-24 sm:min-h-28 items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white px-4 py-5 sm:px-6 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent" strokeWidth={2} />
                    <div>
                      <p className="font-heading text-xl sm:text-2xl font-extrabold leading-none text-foreground">{displayValue}</p>
                      <p className="mt-1.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground leading-tight">{stat.label}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 relative overflow-hidden">
        <img src={bgCta} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container text-center relative z-10 text-primary-foreground">
          <h2 className="font-heading font-bold text-2xl md:text-4xl mb-3">Ready to Get Pure Water?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto text-sm">
            Talk to our experts for free consultation and find the perfect purifier for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              type="button"
              size="lg"
              onClick={() => openWhatsAppWithTracking("About CTA", "Hi! I need help with WaterFilterStore products.")}
              className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-heading font-semibold rounded-full px-8"
            >
              Chat on WhatsApp
            </Button>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-heading font-semibold border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
