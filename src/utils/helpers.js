/**
 * Safely parse tags - handles string, array, or null/undefined
 * @param {any} tags - Tags from API (might be string, array, or null)
 * @returns {Array} - Always returns an array
 */
export const parseTags = (tags) => {
  if (!tags) return [];

  // If already an array, return it
  if (Array.isArray(tags)) return tags;

  // If it's a string, try to parse as JSON
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // If not valid JSON, return empty array
      return [];
    }
  }

  // Fallback for any other type
  return [];
};
