/**
 * Normalization — clean and standardize formatting, numbering, headings, citations.
 */

export function normalizeDocumentText(text: string): string {
  if (!text || typeof text !== "string") return "";
  let out = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\t/g, " ").replace(/\u00A0/g, " ");
  out = out.replace(/^(Article|Section|§|Стаття|Ст\.|Art\.?|Sec\.?)\s*(\d+[a-z]?)\s*[.:\-]\s*/gim, (_, label, num) => `${label} ${num}. `);
  out = out.replace(/(\d+)\s*[.)]\s+/g, "$1. ");
  out = out.replace(/\s+/g, " ").replace(/\s*\.\s*\.\s*/g, "..").replace(/\s*,\s*/g, ", ");
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}
