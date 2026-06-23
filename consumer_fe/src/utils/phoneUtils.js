const GHANA_COUNTRY_CODE = "233";

/** Strip formatting — API expects digits only e.g. 2335569069690 */
export function normalizePhoneForApi(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";

  // Local Ghana format: 0XXXXXXXXX (10 digits) → 233XXXXXXXXX
  if (digits.length === 10 && digits.startsWith("0")) {
    digits = `${GHANA_COUNTRY_CODE}${digits.slice(1)}`;
  }

  return digits;
}

/** Email unchanged; phone normalized for API */
export function normalizeEmailOrPhoneForApi(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (trimmed.includes("@")) return trimmed;
  return normalizePhoneForApi(trimmed);
}
