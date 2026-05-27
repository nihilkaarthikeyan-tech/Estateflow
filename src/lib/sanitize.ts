/**
 * Input sanitization helpers — strip HTML/script tags and trim whitespace.
 * Prevents stored XSS from reaching the dashboard.
 */

/** Remove HTML tags, null bytes, and leading/trailing whitespace */
export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\0/g, "")           // null bytes
    .replace(/<[^>]*>/g, "")       // HTML tags
    .replace(/javascript:/gi, "")  // JS pseudo-protocol
    .trim();
}

/** Sanitize and cap length */
export function sanitizeField(value: unknown, maxLen = 500): string {
  return sanitizeString(value).slice(0, maxLen);
}

/** Validate a phone number — must contain only digits, spaces, +, -, () */
export function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

/** Validate basic email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
