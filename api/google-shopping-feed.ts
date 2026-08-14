import { defaultProducts } from "./default-products.js";

const PROJECT_ID = "aqua-water-ac9a8";
const STORE_ORIGIN = "https://waterfilterstore.in";

const decodeValue = (value = {}) => {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if (value.arrayValue) return (value.arrayValue.values || []).map(decodeValue);
  if (value.mapValue) return decodeFields(value.mapValue.fields || {});
  return undefined;
};

const decodeFields = (fields) =>
  Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));

const escapeXml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const absoluteImageUrl = (image, productId) => {
  if (typeof image !== "string" || !image || image === "/placeholder.svg" || image.startsWith("/src/")) {
    return `${STORE_ORIGIN}/images/premium-ro-purifier.png`;
  }
  if (image.startsWith("data:image/")) return `${STORE_ORIGIN}/api/product-image?id=${encodeURIComponent(productId)}`;
  if (image.startsWith("https://") || image.startsWith("http://")) return image;
  if (image.startsWith("/")) return `${STORE_ORIGIN}${image}`;
  return `${STORE_ORIGIN}/${image}`;
};

export default async function handler(_request, response) {
  try {
    const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products?pageSize=1000`;
    const statusEndpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/catalogStatus`;
    const [firestoreResponse, statusResponse] = await Promise.all([fetch(endpoint), fetch(statusEndpoint)]);
    if (!firestoreResponse.ok) throw new Error(`Firestore returned ${firestoreResponse.status}`);
    const payload = await firestoreResponse.json();
    const statusPayload = statusResponse.ok ? await statusResponse.json() : null;
    const catalogInitialized = statusPayload
      ? decodeFields(statusPayload.fields || {}).initialized === true
      : false;
    const remoteProducts = (payload.documents || []).map((document) => ({
      id: document.name.split("/").pop(),
      ...decodeFields(document.fields || {}),
    }));
    const products = catalogInitialized || remoteProducts.length > 0 ? remoteProducts : defaultProducts;

    const items = products
      .filter((product) => product.slug && product.name && product.price?.selling)
      .map((product) => {
        const link = `${STORE_ORIGIN}/products/${encodeURIComponent(product.slug)}`;
        const availability = product.stock === "out_of_stock" ? "out_of_stock" : "in_stock";
        return `<item>
  <g:id>${escapeXml(product.sku || product.id)}</g:id>
  <title>${escapeXml(product.name)}</title>
  <description>${escapeXml(product.description)}</description>
  <link>${escapeXml(link)}</link>
  <g:canonical_link>${escapeXml(link)}</g:canonical_link>
  <g:image_link>${escapeXml(absoluteImageUrl(product.images?.[0], product.id))}</g:image_link>
  <g:availability>${availability}</g:availability>
  <g:price>${escapeXml(product.price.selling)} INR</g:price>
  <g:condition>new</g:condition>
  <g:brand>WaterFilterStore</g:brand>
  <g:mpn>${escapeXml(product.sku || product.id)}</g:mpn>
</item>`;
      }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>WaterFilterStore Products</title>
<link>${STORE_ORIGIN}/products</link>
<description>Water purifiers, filters and commercial water-treatment products.</description>
${items}
</channel>
</rss>`;

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
    response.status(200).send(xml);
  } catch (error) {
    response.status(500).send(`Unable to generate product feed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
