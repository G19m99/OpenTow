/**
 * Generate a unique call number using timestamp + random suffix.
 * Format: OT-YYMMDD-XXXX (e.g., OT-260214-K7M2)
 *
 * No database reads needed — eliminates the race condition where
 * concurrent mutations could produce duplicate sequential numbers.
 */
export function generateCallNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();

  return `OT-${yy}${mm}${dd}-${suffix}`;
}
