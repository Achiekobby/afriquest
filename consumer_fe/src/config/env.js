const env = {
  appName: process.env.REACT_APP_APP_NAME || "AfriQwest Global",
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  contactEmail: process.env.REACT_APP_CONTACT_EMAIL || "info@afriqwestglobal.com",
  contactPhoneUs: process.env.REACT_APP_CONTACT_PHONE_US || "+13464331792",
  contactPhoneGh: process.env.REACT_APP_CONTACT_PHONE_GH || "+233240000000",
  whatsappNumber: process.env.REACT_APP_WHATSAPP_NUMBER || "233240000000",
  websiteUrl: process.env.REACT_APP_WEBSITE_URL || "https://www.afriqwestglobal.com",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};

export function getWhatsAppUrl(message = "") {
  const text = encodeURIComponent(message);
  return `https://wa.me/${env.whatsappNumber}${text ? `?text=${text}` : ""}`;
}

export default env;
