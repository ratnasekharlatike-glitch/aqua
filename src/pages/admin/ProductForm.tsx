import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, GripVertical, ImagePlus, Plus, Save, Star, Trash2, X } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";
import type { Product } from "@/data/products";
import {
  categorySkuPrefix,
  defaultFeatureOptions,
  defaultSpecificationOptions,
} from "@/data/productDefaults";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { moveImage, optimizeProductImage } from "@/lib/productImages";
import { getGoogleShoppingUrl } from "@/lib/productUrls";

const emptyProduct = {
  name: "",
  slug: "",
  sku: "",
  category: "ro-purifiers",
  description: "",
  features: [""],
  solutions: [] as string[],
  specifications: {} as Record<string, string>,
  price: { selling: 0, original: 0, discount: 0 },
  images: [] as string[],
  stock: "in_stock" as StockStatus,
  warranty: "1 Year Comprehensive",
  rating: 0,
  reviewCount: 0,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProductStore();
  const categories = useCategoryStore((s) => s.categories);
  const { toast } = useToast();
  const settings = useSiteSettingsStore((s) => s.settings);
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyProduct);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [featureOption, setFeatureOption] = useState(defaultFeatureOptions[0]);
  const [solutionOption, setSolutionOption] = useState(settings.productSolutions[0] || "");
  const [specOption, setSpecOption] = useState(defaultSpecificationOptions[0].key);
  const [imageError, setImageError] = useState("");
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const googleShoppingUrl = form.slug ? getGoogleShoppingUrl(form.slug) : "Created automatically from the product name";

  useEffect(() => {
    if (isEdit && id) {
      const product = products.find((p) => p.id === id);
      if (product) {
        setForm({
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          category: product.category,
          description: product.description,
          features: product.features.length > 0 ? product.features : [""],
          solutions: product.solutions || [],
          specifications: { ...product.specifications },
          price: { ...product.price },
          images: [...product.images],
          stock: product.stock,
          warranty: product.warranty,
          rating: product.rating,
          reviewCount: product.reviewCount,
        });
      }
    }
  }, [isEdit, id, products]);

  useEffect(() => {
    if (!isEdit && !form.sku) {
      setForm((current) => ({ ...current, sku: getNextSku(current.category) }));
    }
  }, [isEdit, form.sku, form.category, products]);

  useEffect(() => {
    if (!solutionOption && settings.productSolutions.length > 0) {
      setSolutionOption(settings.productSolutions[0]);
    }
  }, [solutionOption, settings.productSolutions]);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }));
  };

  const getNextSku = (categorySlug: string) => {
    const prefix = categorySkuPrefix[categorySlug] || "ASW-PRD";
    const maxSequence = products.reduce((max, product) => {
      const match = product.sku.match(new RegExp(`^${prefix}-(\\d+)$`));
      if (!match) return max;
      return Math.max(max, Number(match[1]));
    }, 0);
    return `${prefix}-${String(maxSequence + 1).padStart(3, "0")}`;
  };

  const handlePriceChange = (field: "selling" | "original", value: number) => {
    setForm((f) => {
      const price = { ...f.price, [field]: value };
      if (price.original > 0 && price.selling > 0) {
        price.discount = Math.round(((price.original - price.selling) / price.original) * 100);
      }
      return { ...f, price };
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    setForm((f) => {
      const features = [...f.features];
      features[index] = value;
      return { ...f, features };
    });
  };

  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, ""] }));
  const addFeatureFromDropdown = () =>
    setForm((f) => {
      if (f.features.includes(featureOption)) return f;
      return { ...f, features: [...f.features.filter(Boolean), featureOption] };
    });
  const removeFeature = (index: number) =>
    setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));

  const addSolution = () =>
    setForm((f) => {
      if (!solutionOption) return f;
      if (f.solutions?.includes(solutionOption)) return f;
      return { ...f, solutions: [...(f.solutions || []), solutionOption] };
    });

  const removeSolution = (index: number) =>
    setForm((f) => ({ ...f, solutions: (f.solutions || []).filter((_, i) => i !== index) }));

  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setForm((f) => ({
        ...f,
        specifications: { ...f.specifications, [specKey.trim()]: specValue.trim() },
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const addSpecFromDropdown = () => {
    const selected = defaultSpecificationOptions.find((item) => item.key === specOption);
    if (!selected) return;
    setForm((f) => ({
      ...f,
      specifications: {
        ...f.specifications,
        [selected.key]: f.specifications[selected.key] || selected.value,
      },
    }));
  };

  const removeSpec = (key: string) => {
    setForm((f) => {
      const specifications = { ...f.specifications };
      delete specifications[key];
      return { ...f, specifications };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.sku.trim()) {
      toast({ title: "Error", description: "Name and SKU are required.", variant: "destructive" });
      return;
    }
    if (!form.description.trim()) {
      toast({ title: "Description required", description: "Add a clear product description before saving.", variant: "destructive" });
      return;
    }
    if (!form.images[0] || form.images[0] === "/placeholder.svg") {
      toast({ title: "Error", description: "Product image is required.", variant: "destructive" });
      return;
    }

    const cleanFeatures = form.features.filter((f) => f.trim());
    const productData = { ...form, features: cleanFeatures };

    if (isEdit && id) {
      updateProduct(id, productData);
      toast({ title: "Product updated", description: `"${form.name}" has been updated.` });
    } else {
      addProduct(productData);
      toast({ title: "Product added", description: `"${form.name}" has been created.` });
    }

    navigate("/admin/products");
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;
    const currentImages = form.images.filter((image) => image !== "/placeholder.svg");
    if (currentImages.length + selectedFiles.length > 8) {
      setImageError("You can add up to 8 images per product.");
      event.target.value = "";
      return;
    }

    setIsProcessingImages(true);
    try {
      const optimizedImages = await Promise.all(selectedFiles.map(optimizeProductImage));
      setForm((prev) => ({
        ...prev,
        images: [...prev.images.filter((image) => image !== "/placeholder.svg"), ...optimizedImages],
      }));
      setImageError("");
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Could not process the selected images.");
    } finally {
      setIsProcessingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) =>
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));

  const makePrimaryImage = (index: number) =>
    setForm((current) => ({ ...current, images: moveImage(current.images, index, 0) }));

  const handleImageDrop = (targetIndex: number) => {
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;
    setForm((current) => ({
      ...current,
      images: moveImage(current.images, draggedImageIndex, targetIndex),
    }));
    setDraggedImageIndex(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEdit ? "Update product information" : "Fill in the details to add a new product"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. WaterFilterStore RO Purifier"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  placeholder="e.g. ASW-RO-009"
                  required
                />
                {!isEdit && (
                  <p className="text-xs text-muted-foreground">
                    SKU ordering is auto-generated by category. You can edit it manually if needed.
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-generated-from-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value,
                      sku: isEdit ? f.sku : getNextSku(e.target.value),
                    }))
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  The product will automatically appear under this category on the Products page.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopping-url">Google Shopping URL</Label>
              <div className="flex gap-2">
                <Input id="shopping-url" value={googleShoppingUrl} readOnly className="bg-muted/40" />
                {form.slug && (
                  <Button type="button" variant="outline" size="icon" asChild title="Open product landing page">
                    <a href={googleShoppingUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Generated automatically and refreshed whenever the product URL slug changes.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the purification technology, capacity, ideal water source and customer benefit..."
                rows={7}
                required
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>This description is shown on the product detail page.</span>
                <span>{form.description.length} characters</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="selling">Selling Price (₹) *</Label>
                <Input
                  id="selling"
                  type="number"
                  min={0}
                  value={form.price.selling || ""}
                  onChange={(e) => handlePriceChange("selling", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original">Original Price (₹)</Label>
                <Input
                  id="original"
                  type="number"
                  min={0}
                  value={form.price.original || ""}
                  onChange={(e) => handlePriceChange("original", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <div className="h-10 flex items-center px-3 bg-surface rounded-md text-sm text-foreground font-semibold">
                  {form.price.discount}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock & Warranty */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stock & Warranty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Status</Label>
                <select
                  id="stock"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value as StockStatus }))}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  value={form.warranty}
                  onChange={(e) => setForm((f) => ({ ...f, warranty: e.target.value }))}
                  placeholder="e.g. 1 Year Comprehensive"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Features
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <select
                value={featureOption}
                onChange={(e) => setFeatureOption(e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {defaultFeatureOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addFeatureFromDropdown}>
                Add Default
              </Button>
            </div>
            {form.features.map((feature, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                  placeholder={`Feature ${i + 1}`}
                />
                {form.features.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Solutions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <select
                value={solutionOption}
                onChange={(e) => setSolutionOption(e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {settings.productSolutions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addSolution}>
                Add
              </Button>
            </div>
            {(form.solutions || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(form.solutions || []).map((solution, index) => (
                  <span key={`${solution}-${index}`} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                    {solution}
                    <button type="button" onClick={() => removeSolution(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <select
                value={specOption}
                onChange={(e) => setSpecOption(e.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                {defaultSpecificationOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.key}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={addSpecFromDropdown}>
                Add Default
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Specification name"
                className="flex-1"
              />
              <Input
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addSpec}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {Object.entries(form.specifications).length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                {Object.entries(form.specifications).map(([key, value], i) => (
                  <div key={key} className={`flex items-center text-sm ${i % 2 === 0 ? "bg-surface" : "bg-card"}`}>
                    <span className="w-2/5 px-4 py-2.5 font-medium text-foreground">{key}</span>
                    <span className="flex-1 px-4 py-2.5 text-muted-foreground">{value}</span>
                    <button
                      type="button"
                      onClick={() => removeSpec(key)}
                      className="px-3 text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>Product Images</span>
              <span className="text-xs font-normal text-muted-foreground">
                {form.images.filter((image) => image !== "/placeholder.svg").length}/8
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label
              htmlFor="imageFile"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/40 px-5 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <ImagePlus className="mb-2 h-8 w-8 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {isProcessingImages ? "Optimizing images..." : "Choose product images"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">JPG, PNG or WEBP · up to 8 images · 10 MB each</span>
              <Input
                id="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={isProcessingImages}
                onChange={handleImageFileChange}
                className="sr-only"
              />
            </label>
            <div className="rounded-lg bg-primary/5 px-3 py-2 text-xs leading-relaxed text-primary">
              Images are automatically resized to a maximum of 1000 px and converted to WebP. Drag cards to change their priority; image 1 is used as the main product image.
            </div>
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
            {form.images.filter((image) => image !== "/placeholder.svg").length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {form.images.filter((image) => image !== "/placeholder.svg").map((image, index) => (
                  <div
                    key={`${image.slice(0, 40)}-${index}`}
                    draggable
                    onDragStart={() => setDraggedImageIndex(index)}
                    onDragEnd={() => setDraggedImageIndex(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleImageDrop(index)}
                    className={`group overflow-hidden rounded-xl border bg-card shadow-sm transition-all ${draggedImageIndex === index ? "scale-95 opacity-50" : "hover:border-primary/40"}`}
                  >
                    <div className="relative aspect-square bg-white">
                      <img src={image} alt={`Product preview ${index + 1}`} className="h-full w-full object-contain p-2" />
                      <div className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900/80 px-1.5 text-[11px] font-bold text-white">
                        {index + 1}
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">Main image</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t px-2 py-1.5">
                      <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" aria-label="Drag to reorder" />
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <button type="button" onClick={() => makePrimaryImage(index)} className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary" aria-label={`Make image ${index + 1} primary`}>
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                        <button type="button" onClick={() => removeImage(index)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove image ${index + 1}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 sticky bottom-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg border">
          <Button type="submit" size="lg" className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" /> {isEdit ? "Update Product" : "Add Product"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
