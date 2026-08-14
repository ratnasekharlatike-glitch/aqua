const PROJECT_ID = "aqua-water-ac9a8";
const STORE_ORIGIN = "https://waterfilterstore.in";

const decodeImage = (document) => {
  const values = document?.fields?.images?.arrayValue?.values || [];
  return values[0]?.stringValue || "";
};

export default async function handler(request, response) {
  const id = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) return response.status(400).send("Invalid product id");

  try {
    const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/${encodeURIComponent(id)}`;
    const firestoreResponse = await fetch(endpoint);
    if (!firestoreResponse.ok) return response.status(404).send("Image not found");
    const image = decodeImage(await firestoreResponse.json());

    if (image.startsWith("data:image/")) {
      const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) return response.status(404).send("Image not found");
      response.setHeader("Content-Type", match[1]);
      response.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
      return response.status(200).send(Buffer.from(match[2], "base64"));
    }

    if (/^https?:\/\//.test(image)) return response.redirect(302, image);
    if (image.startsWith("/")) return response.redirect(302, `${STORE_ORIGIN}${image}`);
    return response.status(404).send("Image not found");
  } catch {
    return response.status(500).send("Unable to load image");
  }
}
