import { ArrowRight, Home, LifeBuoy, SearchX, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const recoveryLinks = [
  { title: "Visit homepage", description: "Return to the main website", to: "/", icon: Home },
  { title: "Browse products", description: "Explore our water solutions", to: "/products", icon: ShoppingBag },
  { title: "Contact support", description: "Let our team help you", to: "/contact", icon: LifeBuoy },
];

export default function NotFound() {
  const location = useLocation();
  return (
    <Layout>
      <SEO title="Page Not Found" description="The requested page could not be found on WaterFilterStore." noIndex />
      <section className="relative isolate overflow-hidden bg-[#f5f8fb] px-4 py-12 sm:py-16 lg:py-20">
        <div aria-hidden className="absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,35,60,0.10)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[290px] items-center justify-center overflow-hidden bg-[#071A2E] px-6 py-10 text-white sm:min-h-[340px]"><div aria-hidden className="absolute -left-14 -top-14 h-44 w-44 rounded-full border-[28px] border-cyan-400/10" /><div aria-hidden className="absolute -bottom-20 -right-12 h-56 w-56 rounded-full border-[36px] border-white/5" /><div className="relative text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner"><SearchX className="h-8 w-8 text-cyan-300" /></div><p className="font-heading text-[5.5rem] font-black leading-none tracking-tight text-white sm:text-[7rem]">404</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Page not found</p></div></div>
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">You have reached a dry spot</p><h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">We couldn’t find this page.</h1><p className="mt-4 max-w-xl leading-7 text-slate-600">The address may be incorrect, or the page may have been moved. Choose one of the options below to continue.</p><div className="mt-4 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"><span className="font-semibold text-slate-700">Requested:</span>{" "}<span className="break-all">{location.pathname}</span></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#071A2E] px-6 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-[#0b2948]">Back to Home <ArrowRight className="h-4 w-4" /></Link><Link to="/products" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 transition hover:border-primary hover:text-primary">Explore Products</Link></div></div>
          </div>
          <div className="grid border-t border-slate-200 sm:grid-cols-3">{recoveryLinks.map(({ title, description, to, icon: Icon }, index) => <Link key={to} to={to} className={`group flex items-center gap-3 px-5 py-5 transition hover:bg-slate-50 sm:px-6 ${index > 0 ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-primary transition group-hover:bg-primary group-hover:text-white"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-sm font-bold text-slate-900">{title}</span><span className="mt-0.5 block text-xs text-slate-500">{description}</span></span><ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" /></Link>)}</div>
        </div>
      </section>
    </Layout>
  );
}
