import { lazy, Suspense, useEffect } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import { startProductSync } from "@/stores/productStore";
import { startCategorySync } from "@/stores/categoryStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const RequireAdminAuth = lazy(() => import("./components/admin/RequireAdminAuth"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductsList = lazy(() => import("./pages/admin/ProductsList"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const OrdersPlaceholder = lazy(() => import("./pages/admin/OrdersPlaceholder"));
const CustomersPlaceholder = lazy(() => import("./pages/admin/CustomersPlaceholder"));
const SettingsPlaceholder = lazy(() => import("./pages/admin/SettingsPlaceholder"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const BlogsManager = lazy(() => import("./pages/admin/BlogsManager"));
const CategoriesManager = lazy(() => import("./pages/admin/CategoriesManager"));
const HeroSettings = lazy(() => import("./pages/admin/HeroSettings"));
const StatsSettings = lazy(() => import("./pages/admin/StatsSettings"));
const SolutionsSettings = lazy(() => import("./pages/admin/SolutionsSettings"));
const Toaster = lazy(() => import("@/components/ui/toaster").then((module) => ({ default: module.Toaster })));

const App = () => {
  useEffect(() => {
    let stopSync = () => undefined;
    let startTimer: number | undefined;

    const scheduleSync = () => {
      // Keep Firebase and catalogue hydration out of the hero's critical path.
      startTimer = window.setTimeout(() => {
        const stopProduct = startProductSync();
        const stopCategory = startCategorySync();
        stopSync = () => {
          stopProduct();
          stopCategory();
        };
      }, 1000);
    };

    if (document.readyState === "complete") {
      scheduleSync();
    } else {
      window.addEventListener("load", scheduleSync, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleSync);
      if (startTimer !== undefined) window.clearTimeout(startTimer);
      stopSync();
    };
  }, []);

  return (
    <HelmetProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div className="min-h-screen bg-background" aria-label="Loading page" />}>
          <Toaster />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns-refunds" element={<ReturnsRefunds />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdminAuth />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<CategoriesManager />} />
                <Route path="blogs" element={<BlogsManager />} />
                <Route path="orders" element={<OrdersPlaceholder />} />
                <Route path="customers" element={<CustomersPlaceholder />} />
                <Route path="settings" element={<SettingsPlaceholder />} />
                <Route path="settings/hero-images" element={<HeroSettings />} />
                <Route path="settings/stats" element={<StatsSettings />} />
                <Route path="settings/solutions" element={<SolutionsSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
      </Suspense>
    </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
