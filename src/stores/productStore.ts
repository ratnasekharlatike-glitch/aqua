import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as defaultProducts, Product } from "@/data/products";
import { collection, doc, onSnapshot, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getGoogleShoppingUrl } from "@/lib/productUrls";

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (cat: string) => Product[];
  getFeaturedProducts: () => Product[];
}

const sortBySku = (items: Product[]) =>
  items
    .map((product) => ({ ...product, shoppingUrl: getGoogleShoppingUrl(product.slug) }))
    .sort((a, b) => a.sku.localeCompare(b.sku, undefined, { numeric: true }));

let catalogInitialized = false;
let remoteProductDocumentIds = new Set<string>();

const persistCatalogueMutation = async (
  products: Product[],
  options: { changedId?: string; deletedId?: string },
) => {
  const batch = writeBatch(db);
  batch.set(doc(db, "settings", "catalogStatus"), { initialized: true });

  if (!catalogInitialized) {
    const currentIds = new Set(products.map((product) => product.id));
    products.forEach((product) => batch.set(doc(db, "products", product.id), product));
    remoteProductDocumentIds.forEach((id) => {
      if (!currentIds.has(id)) batch.delete(doc(db, "products", id));
    });
  } else if (options.changedId) {
    const changedProduct = products.find((product) => product.id === options.changedId);
    if (changedProduct) batch.set(doc(db, "products", changedProduct.id), changedProduct);
  }

  if (options.deletedId) batch.delete(doc(db, "products", options.deletedId));
  await batch.commit();
  catalogInitialized = true;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: sortBySku(defaultProducts),
      addProduct: (product) =>
        set((state) => {
          const savedProduct = {
            ...product,
            id: crypto.randomUUID(),
            shoppingUrl: getGoogleShoppingUrl(product.slug),
          };
          const products = sortBySku([...state.products, savedProduct]);
          void persistCatalogueMutation(products, { changedId: savedProduct.id }).catch((error) => {
            console.warn("Product saved locally, but cloud sync failed.", error);
          });
          return { products };
        }),
      updateProduct: (id, data) =>
        set((state) => {
          const products = sortBySku(state.products.map((product) => {
            if (product.id !== id) return product;
            const updatedProduct = { ...product, ...data };
            return { ...updatedProduct, shoppingUrl: getGoogleShoppingUrl(updatedProduct.slug) };
          }));
          const savedProduct = products.find((product) => product.id === id);
          if (savedProduct) {
            void persistCatalogueMutation(products, { changedId: id }).catch((error) => {
              console.warn("Product updated locally, but cloud sync failed.", error);
            });
          }
          return { products };
        }),
      deleteProduct: async (id) => {
        const products = get().products.filter((product) => product.id !== id);
        await persistCatalogueMutation(products, { deletedId: id });
        set({ products });
      },
      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
      getProductsByCategory: (cat) =>
        get().products.filter((p) => p.category === cat),
      getFeaturedProducts: () => get().products.slice(0, 4),
    }),
    { name: "aquasafe-products" }
  )
);

let productSyncStarted = false;
let remoteProducts: Product[] = [];

const applyRemoteProducts = () => {
  if (catalogInitialized) {
    useProductStore.setState({ products: sortBySku(remoteProducts) });
    return;
  }

  const productsById = new Map(defaultProducts.map((product) => [product.id, product]));
  useProductStore.getState().products.forEach((product) => productsById.set(product.id, product));
  remoteProducts.forEach((product) => productsById.set(product.id, product));
  useProductStore.setState({ products: sortBySku(Array.from(productsById.values())) });
};

export function startProductSync() {
  if (productSyncStarted) return () => {};
  productSyncStarted = true;

  const unsubscribeStatus = onSnapshot(
    doc(db, "settings", "catalogStatus"),
    (snapshot) => {
      catalogInitialized = snapshot.exists() && snapshot.data().initialized === true;
      applyRemoteProducts();
    },
    (error) => console.warn("Could not read catalogue status.", error),
  );

  const unsubscribeProducts = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      remoteProductDocumentIds = new Set(snapshot.docs.map((productDocument) => productDocument.id));
      remoteProducts = snapshot.docs
        .map((productDocument) => ({ ...productDocument.data(), id: productDocument.id }) as Product)
        .filter((product) => product.name && product.slug && product.sku);
      applyRemoteProducts();
    },
    (error) => console.warn("Using locally cached products because cloud sync is unavailable.", error),
  );

  return () => {
    unsubscribeStatus();
    unsubscribeProducts();
    productSyncStarted = false;
  };
}
