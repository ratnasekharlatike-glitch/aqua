import { defaultProducts } from "./default-products.js";

const PROJECT_ID = "aqua-water-ac9a8";
const STORE_ORIGIN = "https://waterfilterstore.in";

const decodeValue = (value = {}) => {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  return undefined;
};

const escapeXml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export default async function handler(_request, response) {
  try {
    const productsEndpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products?pageSize=1000`;
    const statusEndpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/catalogStatus`;
    const [productsResponse, statusResponse] = await Promise.all([fetch(productsEndpoint), fetch(statusEndpoint)]);
    if (!productsResponse.ok) throw new Error(`Firestore returned ${productsResponse.status}`);

    const productsPayload = await productsResponse.json();
    const statusPayload = statusResponse.ok ? await statusResponse.json() : null;
    const initialized = decodeValue(statusPayload?.fields?.initialized) === true;
    const remoteProducts = (productsPayload.documents || []).map((document) => ({
      slug: decodeValue(document.fields?.slug),
      updatedAt: document.updateTime,
    })).filter((product) => product.slug);
    const products = initialized || remoteProducts.length > 0
      ? remoteProducts
      : defaultProducts.map((product) => ({ slug: product.slug, updatedAt: undefined }));

    const urls = products.map((product) => {
      const lastModified = product.updatedAt ? `<lastmod>${escapeXml(product.updatedAt)}</lastmod>` : "";
      return `<url><loc>${STORE_ORIGIN}/products/${escapeXml(encodeURIComponent(product.slug))}</loc>${lastModified}</url>`;
    }).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
    response.status(200).send(xml);
  } catch (error) {
    response.status(500).send(`Unable to generate product sitemap: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
