import Header from "./Header";
import Footer from "./Footer";
import { X } from "lucide-react";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showWhatsAppGreeting, setShowWhatsAppGreeting] = useState(false);

  const whatsappMessage =
    "Hi WaterFilterStore! I'm looking for a water purifier. Please help me choose the right model for my home.";

  useEffect(() => {
    const timer = window.setTimeout(() => setShowWhatsAppGreeting(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const openWhatsApp = () => {
    setShowWhatsAppGreeting(false);
    openWhatsAppWithTracking("Floating WhatsApp Button", whatsappMessage);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-clip bg-background">
      {/* Premium Background Glow (Aurora Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />

      {/* Floating WhatsApp support */}
      <div className="fixed bottom-5 right-4 z-50 flex items-end gap-2.5 md:bottom-6 md:right-6">
        {showWhatsAppGreeting && (
          <div className="relative mb-1 max-w-[230px] rounded-2xl rounded-br-md border border-emerald-100 bg-white px-4 py-3 pr-8 text-left shadow-xl">
            <button
              type="button"
              onClick={() => setShowWhatsAppGreeting(false)}
              className="absolute right-2 top-2 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close WhatsApp greeting"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={openWhatsApp} className="block text-left">
              <span className="block text-sm font-bold text-slate-900">Hello! 👋</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                Need help choosing a purifier? Chat with our water expert.
              </span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={openWhatsApp}
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_28px_rgba(37,211,102,0.38)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 motion-safe:animate-ping" />
          <img
            src="/images/whatsapp-logo.svg"
            alt=""
            aria-hidden="true"
            width={30}
            height={30}
            className="relative z-10 h-7 w-7 brightness-0 invert"
          />
        </button>
      </div>
    </div>
  );
}
