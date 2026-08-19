import { create } from "zustand";
import { persist } from "zustand/middleware";
import { categories as defaultCategories, Category } from "@/data/categories";

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "productCount">) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => Promise<void>;
}

let catalogInitialized = false;
let remoteCategoryDocumentIds = new Set<string>();

const persistCategoryMutation = async (
  categories: Category[],
  options: { changedId?: string; deletedId?: string },
) => {
  const [{ doc, writeBatch }, { db }] = await Promise.all([
    import("firebase/firestore"),
    import("@/lib/firebase"),
  ]);
  const batch = writeBatch(db);
  batch.set(doc(db, "settings", "categoriesStatus"), { initialized: true });

  if (!catalogInitialized) {
    const currentIds = new Set(categories.map((cat) => cat.id));
    categories.forEach((cat) => batch.set(doc(db, "categories", cat.id), cat));
    remoteCategoryDocumentIds.forEach((id) => {
      if (!currentIds.has(id)) batch.delete(doc(db, "categories", id));
    });
  } else if (options.changedId) {
    const changedCategory = categories.find((cat) => cat.id === options.changedId);
    if (changedCategory) batch.set(doc(db, "categories", changedCategory.id), changedCategory);
  }

  if (options.deletedId) batch.delete(doc(db, "categories", options.deletedId));
  await batch.commit();
  catalogInitialized = true;
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      addCategory: (categoryData) =>
        set((state) => {
          const newCategory = {
            ...categoryData,
            id: crypto.randomUUID(),
            productCount: 0,
          };
          const categories = [...state.categories, newCategory];
          void persistCategoryMutation(categories, { changedId: newCategory.id }).catch((error) => {
            console.warn("Category saved locally, but cloud sync failed.", error);
          });
          return { categories };
        }),
      updateCategory: (id, data) =>
        set((state) => {
          const categories = state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...data } : cat
          );
          void persistCategoryMutation(categories, { changedId: id }).catch((error) => {
            console.warn("Category updated locally, but cloud sync failed.", error);
          });
          return { categories };
        }),
      deleteCategory: async (id) => {
        const categories = get().categories.filter((cat) => cat.id !== id);
        await persistCategoryMutation(categories, { deletedId: id });
        set({ categories });
      },
    }),
    { name: "aquasafe-categories" }
  )
);

let categorySyncStarted = false;
let remoteCategories: Category[] = [];

const applyRemoteCategories = () => {
  if (catalogInitialized) {
    useCategoryStore.setState({ categories: remoteCategories });
    return;
  }

  const categoriesById = new Map(defaultCategories.map((cat) => [cat.id, cat]));
  useCategoryStore.getState().categories.forEach((cat) => categoriesById.set(cat.id, cat));
  remoteCategories.forEach((cat) => categoriesById.set(cat.id, cat));
  useCategoryStore.setState({ categories: Array.from(categoriesById.values()) });
};

export function startCategorySync() {
  if (categorySyncStarted) return () => {};
  categorySyncStarted = true;
  let disposed = false;
  let unsubscribe = () => {};

  void Promise.all([import("firebase/firestore"), import("@/lib/firebase")])
    .then(([{ collection, doc, onSnapshot }, { db }]) => {
      if (disposed) return;
      const unsubscribeStatus = onSnapshot(
        doc(db, "settings", "categoriesStatus"),
        (snapshot) => {
          catalogInitialized = snapshot.exists() && snapshot.data().initialized === true;
          applyRemoteCategories();
        },
        (error) => console.warn("Could not read categories status.", error),
      );
      const unsubscribeCategories = onSnapshot(
        collection(db, "categories"),
        (snapshot) => {
          remoteCategoryDocumentIds = new Set(snapshot.docs.map((doc) => doc.id));
          remoteCategories = snapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }) as Category)
            .filter((cat) => cat.name && cat.slug);
          applyRemoteCategories();
        },
        (error) => console.warn("Using locally cached categories because cloud sync is unavailable.", error),
      );
      unsubscribe = () => {
        unsubscribeStatus();
        unsubscribeCategories();
      };
    })
    .catch((error) => console.warn("Using locally cached categories because cloud sync is unavailable.", error));

  return () => {
    disposed = true;
    unsubscribe();
    categorySyncStarted = false;
  };
}
