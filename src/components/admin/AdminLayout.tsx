import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Image,
  BarChart3,
  Layers,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "All Products", path: "/admin/products" },
  { icon: PlusCircle, label: "Add Product", path: "/admin/products/new" },
  { icon: Layers, label: "Categories", path: "/admin/categories" },
  { icon: FileText, label: "Blogs", path: "/admin/blogs" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: Image, label: "Hero Images", path: "/admin/settings/hero-images" },
  { icon: BarChart3, label: "Stats", path: "/admin/settings/stats" },
  { icon: Layers, label: "Solutions", path: "/admin/settings/solutions" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy text-primary-foreground transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10">
          <Link to="/admin" className="font-heading font-bold text-lg">
            🛡️ WaterFilterStore Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-primary-foreground/70 hover:text-primary-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-foreground/10">
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-sm text-primary-foreground/50 hover:text-primary-foreground hover:bg-transparent px-0 py-0 h-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-heading font-semibold text-foreground text-lg flex-1">
            Admin Panel
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              A
            </div>
            <span className="hidden sm:inline">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
