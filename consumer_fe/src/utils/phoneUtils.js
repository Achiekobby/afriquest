/** Strip formatting — API expects digits only e.g. 2335569069690 */
export function normalizePhoneForApi(phone) {
  return String(phone || "").replace(/\D/g, "");
}
