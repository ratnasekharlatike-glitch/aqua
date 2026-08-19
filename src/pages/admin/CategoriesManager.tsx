import { useState } from "react";
import { PlusCircle, Pencil, Trash2, ImagePlus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { optimizeProductImage } from "@/lib/productImages";

export default function CategoriesManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "💧",
  });

  const handleOpenDialog = (category: any = null) => {
    if (category) {
      setIsEditMode(true);
      setCurrentCategoryId(category.id);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
      });
    } else {
      setIsEditMode(false);
      setCurrentCategoryId("");
      setFormData({ name: "", slug: "", description: "", icon: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast({ title: "Error", description: "Name and Slug are required.", variant: "destructive" });
      return;
    }
    
    if (isEditMode) {
      updateCategory(currentCategoryId, formData);
      toast({ title: "Category Updated", description: `"${formData.name}" has been updated.` });
    } else {
      addCategory(formData);
      toast({ title: "Category Added", description: `"${formData.name}" has been created.` });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    deleteCategory(id);
    toast({ title: "Category Deleted", description: `"${name}" has been removed.` });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessingImage(true);
    try {
      const optimizedImage = await optimizeProductImage(file);
      setFormData({ ...formData, icon: optimizedImage });
    } catch (error) {
      toast({ title: "Image Upload Failed", description: error instanceof Error ? error.message : "Failed to process image.", variant: "destructive" });
    } finally {
      setIsProcessingImage(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground">Manage your product categories</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setFormData({ ...formData, name, slug: isEditMode ? formData.slug : slug });
                  }}
                  placeholder="e.g. RO Purifiers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. ro-purifiers"
                />
              </div>
              <div className="space-y-2">
                <Label>Category Image</Label>
                <div className="flex items-center gap-4">
                  {formData.icon && (
                    <div className="h-16 w-16 rounded-lg border bg-surface flex items-center justify-center overflow-hidden shrink-0">
                      {formData.icon.startsWith("data:") || formData.icon.startsWith("/") || formData.icon.startsWith("http") ? (
                        <img src={formData.icon} alt="Preview" className="h-full w-full object-contain p-1" />
                      ) : (
                        <span className="text-2xl">{formData.icon}</span>
                      )}
                    </div>
                  )}
                  <label
                    htmlFor="iconFile"
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-dashed py-4 transition-colors hover:bg-muted/50"
                  >
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {isProcessingImage ? "Compressing..." : "Upload Image"}
                    </span>
                    <input
                      id="iconFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={isProcessingImage}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of the category..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{isEditMode ? "Update" : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.icon?.startsWith("data:") || category.icon?.startsWith("/") || category.icon?.startsWith("http") ? (
                    <img src={category.icon} alt="" className="h-8 w-8 object-contain rounded" />
                  ) : (
                    <span className="text-xl">{category.icon}</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">{category.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id, category.name)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
