import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";
import ProductCard from "@/components/products/ProductCard";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Products() {
  const products = useProductStore((s) => s.products);
  const categories = useCategoryStore((s) => s.categories);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const activeCategory = searchParams.get("category") || "";
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.stock !== "out_of_stock");
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sort === "price-low") result.sort((a, b) => a.price.selling - b.price.selling);
    else if (sort === "price-high") result.sort((a, b) => b.price.selling - a.price.selling);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, search, sort, products]);

  const setCategory = (slug: string) => {
    if (slug) setSearchParams({ category: slug });
    else setSearchParams({});

    setShowFilters(false);
    window.setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <Layout>
      <SEO
        title="Water Purifiers & RO Plants in Visakhapatnam"
        description="Shop RO, UV, UF and alkaline water purifiers, commercial RO plants, filters and accessories in Visakhapatnam. Free delivery and installation available."
        keywords="water purifier Visakhapatnam, RO water purifier Gajuwaka, UV water purifier Andhra Pradesh, commercial RO plant Visakhapatnam, water filter cartridges, alkaline water purifier, WaterFilterStore"
      />
      <div className="container py-4 md:py-10">
        {/* Marketplace search and controls */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-4 bg-background/95 backdrop-blur-md border-b md:static md:mx-0 md:px-0 md:py-0 md:mb-8 md:bg-transparent md:border-0">
          <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Search water purifiers, filters and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 md:h-12 pl-11 pr-10 rounded-lg bg-secondary/40 border-border shadow-sm focus-visible:ring-primary"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="hidden md:block h-12 min-w-48 rounded-lg border bg-background px-4 text-sm font-medium shadow-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 md:hidden">
            <Button variant="outline" className="h-10 rounded-md font-semibold" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filter{activeCategory ? " (1)" : ""}
            </Button>
            <label className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full h-10 rounded-md border bg-background pl-9 pr-2 text-sm font-semibold appearance-none text-center">
                <option value="popular">Sort: Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </label>
          </div>
        </div>

        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="bottom" className="rounded-t-2xl px-5 pb-8 md:hidden">
            <SheetHeader className="text-left mb-5">
              <SheetTitle>Filter by category</SheetTitle>
            </SheetHeader>
            <div className="space-y-2">
              <button onClick={() => setCategory("")} className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium ${!activeCategory ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                <span>All Products</span><span>{products.filter((p) => p.stock !== "out_of_stock").length}</span>
              </button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.slug)} className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium ${activeCategory === cat.slug ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                  <span>{cat.name}</span><span>{products.filter((p) => p.stock !== "out_of_stock" && p.category === cat.slug).length}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-24 rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-heading font-bold text-base text-foreground">Filters</h3>
                {activeCategory && <button onClick={() => setCategory("")} className="text-xs font-semibold text-primary">Clear all</button>}
              </div>
              <div className="p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Categories</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setCategory("")}
                    className={`flex w-full items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${!activeCategory ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}
                  >
                    <span>All Products</span><span className="text-xs opacity-60">{products.filter((p) => p.stock !== "out_of_stock").length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`flex w-full items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${activeCategory === cat.slug ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}
                    >
                      <span>{cat.name}</span><span className="text-xs opacity-60">{products.filter((p) => p.stock !== "out_of_stock" && p.category === cat.slug).length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div ref={productsRef} className="flex-1 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-base md:text-xl">{activeCategory ? categories.find((cat) => cat.slug === activeCategory)?.name : "All Products"}</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{filtered.length} products found</p>
              </div>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products found</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCategory(""); }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
