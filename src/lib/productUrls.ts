export const STORE_ORIGIN = "https://waterfilterstore.in";

export const getGoogleShoppingUrl = (slug: string) =>
  `${STORE_ORIGIN}/products/${encodeURIComponent(slug.trim())}`;
