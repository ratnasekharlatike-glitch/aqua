import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { generateOrderMessage, redirectToWhatsAppWithTracking } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/orders";
import SEO from "@/components/SEO";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  const handleCheckout = () => {
    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      slug: i.slug,
    }));
    const hasCustomer = [customer.name, customer.phone, customer.address].some((v) => v.trim());
    const customerPayload = hasCustomer ? customer : undefined;
    const message = generateOrderMessage(orderItems, customerPayload, {
      siteOrigin: typeof window !== "undefined" ? window.location.origin : "",
    });

    void createOrder(
      orderItems.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      customerPayload
    ).catch(() => {
      // Best-effort; checkout still continues to WhatsApp.
    });

    clearCart();
    redirectToWhatsAppWithTracking("Cart Checkout", message);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <SEO title="Shopping Cart" description="Review your selected WaterFilterStore products and order through WhatsApp." noIndex />
        <div className="container py-20 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Link to="/products"><Button>Browse Products</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Shopping Cart" description="Review your selected water purifiers and complete your WaterFilterStore order through WhatsApp." noIndex />
      <div className="container py-8 md:py-12">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Cart</span>
        </nav>

        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8">
          {step === "cart" ? "Shopping Cart" : "Checkout"}
        </h1>

        {step === "cart" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-card rounded-lg border p-4">
                  <div className="h-20 w-20 bg-secondary rounded-md shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.slug}`} className="font-heading font-semibold text-sm text-foreground hover:text-primary line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground line-through mt-0.5">₹{item.originalPrice.toLocaleString("en-IN")}</p>
                    <p className="font-heading font-bold text-foreground">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 border rounded-md">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg border p-6 h-fit sticky top-24">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice().toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-whatsapp font-medium">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-heading font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span>₹{totalPrice().toLocaleString("en-IN")}</span>
                </div>
              </div>
              <Button size="lg" className="w-full mt-6 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-heading font-semibold" onClick={handleCheckout}>
                Place order on WhatsApp
              </Button>
              <Button type="button" variant="outline" size="sm" className="w-full mt-2 font-medium" onClick={() => setStep("checkout")}>
                Add delivery details first (optional)
              </Button>
              <Button variant="ghost" size="sm" className="w-full mt-1 text-destructive" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => setStep("cart")} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart
            </Button>

            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Delivery Details (Optional)</h3>
              <p className="text-sm text-muted-foreground">Fill in your details or skip to order directly via WhatsApp.</p>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Delivery Address</label>
                <Textarea rows={3} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="Full delivery address" />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-heading font-bold text-lg text-foreground mb-4">
                  <span>Total</span>
                  <span>₹{totalPrice().toLocaleString("en-IN")}</span>
                </div>
                <Button size="lg" className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-heading font-semibold" onClick={handleCheckout}>
                  Complete Order via WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">Our team will confirm your order within 2 hours</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
