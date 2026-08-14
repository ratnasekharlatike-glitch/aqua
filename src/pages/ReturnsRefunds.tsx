import { AlertCircle, CheckCircle2, Mail, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";

export default function ReturnsRefunds() {
  const settings = useSiteSettingsStore((state) => state.settings);
  return (
    <Layout>
      <SEO title="Returns & Refunds Policy" description="Read the WaterFilterStore returns, refunds, damaged-product and order issue policy." keywords="WaterFilterStore return policy, water purifier refund policy, damaged product support" />
      <main className="bg-slate-50 py-10 sm:py-14 lg:py-16">
        <div className="container max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <header className="bg-[#071A2E] px-6 py-9 text-white sm:px-10 sm:py-12">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Customer Policy</p>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">Returns & Refunds Policy</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Please review this policy carefully before placing an order with WaterFilterStore.</p>
            </header>
            <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
                <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" /><div><h2 className="font-heading text-xl font-bold text-slate-950">All sales are final</h2><p className="mt-2 leading-7 text-slate-700">Products purchased from WaterFilterStore are not eligible for return, exchange or refund after the order has been delivered and accepted, including change-of-mind purchases.</p></div></div>
              </section>
              <section>
                <h2 className="font-heading text-xl font-bold text-slate-950">Damaged, defective or incorrect products</h2>
                <p className="mt-3 leading-7 text-slate-600">This no-return policy does not limit rights available under applicable law. If an item arrives damaged, has a verified manufacturing defect, or is different from the product ordered, contact us promptly after delivery. We will inspect the issue and provide the remedy required under the product warranty or applicable consumer law.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">{["Keep the original packaging and invoice", "Share clear photos or video of the issue", "Do not install or modify an incorrect item", "Provide the order number and delivery date"].map((item) => <div key={item} className="flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{item}</span></div>)}</div>
              </section>
              <section className="border-t border-slate-200 pt-8"><h2 className="font-heading text-xl font-bold text-slate-950">Order cancellation</h2><p className="mt-3 leading-7 text-slate-600">Cancellation requests may be considered only before dispatch. Once an order has been dispatched, installed or delivered, it cannot be cancelled or refunded except where required by applicable law.</p></section>
              <section className="rounded-2xl bg-slate-100 p-5 sm:p-6"><h2 className="font-heading text-xl font-bold text-slate-950">Need assistance?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Contact our team with your order details before taking further action.</p><div className="mt-4 flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:gap-6"><a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-slate-900 hover:text-primary"><Phone className="h-4 w-4" /> {settings.phone}</a><a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 text-slate-900 hover:text-primary"><Mail className="h-4 w-4" /> {settings.email}</a></div></section>
              <p className="text-xs text-slate-500">Last updated: 14 August 2026</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
