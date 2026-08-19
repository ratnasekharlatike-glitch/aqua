import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Pencil, PlusCircle, Search, Trash2 } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategoryStore } from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function ProductsList() {
  const { products, deleteProduct, updateProduct } = useProductStore();
  const categories = useCategoryStore((s) => s.categories);
  const [search, setSearch] = useState("");
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name || slug;

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteProduct(id)));
      toast({ title: "Products deleted", description: `${selectedIds.length} products have been removed.` });
      setSelectedIds([]);
    } catch {
      toast({ title: "Bulk delete failed", description: "Some products could not be removed.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteProduct(id);
      toast({ title: "Product permanently deleted", description: `"${name}" has been removed from the database and website.` });
    } catch {
      toast({ title: "Delete failed", description: `"${name}" was not removed. Please check your connection and try again.`, variant: "destructive" });
    }
  };

  const savePrice = (id: string) => {
    const product = products.find((item) => item.id === id);
    const selling = Number(priceDrafts[id]);
    if (!product || !Number.isFinite(selling) || selling <= 0) {
      toast({ title: "Invalid price", description: "Enter a valid selling price greater than zero.", variant: "destructive" });
      return;
    }
    const original = Math.max(product.price.original, selling);
    const discount = original > 0 ? Math.max(0, Math.round(((original - selling) / original) * 100)) : 0;
    updateProduct(id, { price: { ...product.price, selling, original, discount } });
    setPriceDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    toast({ title: "Price updated", description: `${product.name} is now ₹${selling.toLocaleString("en-IN")}.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Products</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedIds.length} products? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link to="/admin/products/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">SKU</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} data-state={selectedIds.includes(product.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleSelect(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-surface rounded overflow-hidden shrink-0">
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-medium text-sm text-foreground line-clamp-1">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{getCategoryName(product.category)}</TableCell>
                <TableCell>
                  <div className="flex min-w-[130px] items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">₹</span>
                    <Input
                      type="number"
                      min={1}
                      value={priceDrafts[product.id] ?? String(product.price.selling)}
                      onChange={(event) => setPriceDrafts((current) => ({ ...current, [product.id]: event.target.value }))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          savePrice(product.id);
                        }
                      }}
                      className="h-8 w-24 px-2 text-sm font-medium"
                      aria-label={`Selling price for ${product.name}`}
                    />
                    {priceDrafts[product.id] !== undefined && Number(priceDrafts[product.id]) !== product.price.selling && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => savePrice(product.id)} className="h-8 w-8 shrink-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" aria-label={`Save price for ${product.name}`}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    product.stock === "in_stock" ? "bg-whatsapp/10 text-whatsapp" : product.stock === "low_stock" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                  }`}>
                    {product.stock === "in_stock" ? "In Stock" : product.stock === "low_stock" ? "Low Stock" : "Out of Stock"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id, product.name)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
