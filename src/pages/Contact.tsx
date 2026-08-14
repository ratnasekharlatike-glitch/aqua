import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { toast } from "@/hooks/use-toast";
import bgHero from "@/assets/bg-hero-dark.jpg";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import { FORMSPREE_CONTACT_ENDPOINT, persistContactEnquiry, submitContactToFormspree } from "@/lib/enquiries";

export default function Contact() {
  const settings = useSiteSettingsStore((s) => s.settings);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContactToFormspree(form);
      void persistContactEnquiry(form).catch(() => {
        // Formspree delivery succeeded; Firebase is a secondary admin-panel copy.
      });
      toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Could not send message",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <SEO title="Contact WaterFilterStore in Visakhapatnam" description="Contact WaterFilterStore in Gajuwaka, Visakhapatnam for water purifier sales, free consultation, installation, repairs and RO service support. Call or WhatsApp +91 9985851237." keywords="water purifier shop Visakhapatnam contact, RO service Gajuwaka, water purifier installation Visakhapatnam, WaterFilterStore phone number, RO repair near me" />
      <div className="relative text-primary-foreground py-10 md:py-14 overflow-hidden">
        <img src={settings.heroImages.contact || bgHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="container relative z-10">
          <nav className="text-sm mb-4 opacity-70">
            <Link to="/" className="hover:opacity-100">Home</Link> / <span>Contact</span>
          </nav>
          <h1 className="font-heading font-bold text-3xl md:text-5xl">Contact Us</h1>
          <p className="mt-4 opacity-80 text-lg">We'd love to hear from you. Get in touch today!</p>
        </div>
      </div>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Send us a Message</h2>
              <form action={FORMSPREE_CONTACT_ENDPOINT} method="POST" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                    <Input required name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                    <Input required name="email" autoComplete="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                    <Input name="phone" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Subject *</label>
                    <Input required name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                  <Textarea required name="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." />
                </div>
                <Button type="submit" size="lg" disabled={sending} className="font-heading font-semibold">
                  <Send className="h-4 w-4 mr-2" /> {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact info */}
            <div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Address</h4>
                    <p className="text-sm text-muted-foreground mt-1">{settings.address}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Phone</h4>
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-sm text-primary hover:underline mt-1 block">{settings.phone}</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Email</h4>
                    <a href={`mailto:${settings.email}`} className="text-sm text-primary hover:underline mt-1 block">{settings.email}</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Business Hours</h4>
                    <p className="text-sm text-muted-foreground mt-1">{settings.businessHours}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-lg overflow-hidden border h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.4!2d83.2!3d17.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVisakhapatnam!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="WaterFilterStore Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
