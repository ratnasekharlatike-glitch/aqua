import { useSiteSettingsStore } from "@/stores/siteSettingsStore";

const trackWhatsAppEnquiry = (source: string, message: string) => {
  void import("@/lib/enquiries")
    .then(({ persistWhatsAppEnquiry }) => persistWhatsAppEnquiry(source, message))
    .catch(() => {});
};

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug?: string;
}

export const generateWhatsAppLink = (message: string) => {
  const number = useSiteSettingsStore.getState().settings.whatsappNumber || "919985851237";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const generateOrderMessage = (
  items: CartItem[],
  customerInfo?: { name: string; phone: string; address: string },
  options?: { siteOrigin?: string }
) => {
  const origin =
    options?.siteOrigin ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const itemLines = items
    .map((item) => {
      const lineTotal = item.price * item.quantity;
      let line = `• ${item.name}\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")} = ₹${lineTotal.toLocaleString("en-IN")}`;
      if (item.slug && origin) {
        line += `\n   ${origin}/products/${item.slug}`;
      }
      return line;
    })
    .join("\n\n");

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = `🛒 *New order — WaterFilterStore*\n\n`;
  message += `*Items*\n${itemLines}\n\n`;
  message += `*Order total: ₹${total.toLocaleString("en-IN")}*\n`;

  if (customerInfo) {
    const { name, phone, address } = customerInfo;
    if (name.trim() || phone.trim() || address.trim()) {
      message += `\n*Delivery / contact*\n`;
      if (name.trim()) message += `Name: ${name.trim()}\n`;
      if (phone.trim()) message += `Phone: ${phone.trim()}\n`;
      if (address.trim()) message += `Address:\n${address.trim()}\n`;
    }
  }

  message += `\nPlease confirm availability and share payment / delivery details. Thank you! 🙏`;

  return message;
};

export const generateProductEnquiry = (productName: string, price: number) => {
  return `Hi! I'm interested in *${productName}* (₹${price.toLocaleString("en-IN")}). Could you share more details and availability?`;
};

export const openWhatsAppWithTracking = (source: string, message: string) => {
  trackWhatsAppEnquiry(source, message);
  window.open(generateWhatsAppLink(message), "_blank", "noopener,noreferrer");
};

/** Same-window navigation — use after async work so WhatsApp is not blocked as a popup. */
export const redirectToWhatsAppWithTracking = (source: string, message: string) => {
  trackWhatsAppEnquiry(source, message);
  window.location.assign(generateWhatsAppLink(message));
};
