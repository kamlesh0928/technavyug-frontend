/**
 * Safely parse tags - handles string, array, or null/undefined
 * @param {any} tags - Tags from API (might be string, array, or null)
 * @returns {Array} - Always returns an array
 */
export const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Safely parse images from DB (can be Array or JSON string)
 * @param {any} raw - Raw image data
 * @returns {Array} - Always returns an array of image URLs
 */
export function parseImages(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((u) => typeof u === "string" && u.trim());
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string" && u.trim()) : [];
    } catch {
      return [];
    }
  }
  return [];
}
