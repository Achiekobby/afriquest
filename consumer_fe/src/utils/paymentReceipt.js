import env from "../config/env";
import { formatBookingCurrency } from "./bookingHelpers";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatReceiptDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDepartureDate(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function mapVerifiedPaymentToReceipt(paymentData) {
  if (!paymentData) return null;

  const booking = paymentData.booking || {};
  const tour = booking.tour || {};
  const locations = Array.isArray(tour.locations) ? tour.locations.filter(Boolean).join(" · ") : tour.country || "";

  return {
    paymentReference: paymentData.reference || "",
    paymentSlug: paymentData.paymentSlug || "",
    bookingRef: booking.bookingCode || paymentData.bookingCode || "",
    amount: Number(paymentData.amount) || 0,
    currency: paymentData.currency || "GHS",
    amountLabel: formatBookingCurrency(paymentData.amount, paymentData.currency),
    paidAt: paymentData.paidAt,
    status: paymentData.status,
    bookingStatus: booking.status,
    tour: {
      name: tour.name || "Tour booking",
      location: locations,
      country: tour.country || "",
      duration: tour.durationLabel || (tour.durationDays ? `${tour.durationDays} days` : ""),
      image: tour.coverImageUrl || "",
    },
    selectedDate: formatDepartureDate(booking.selectedDate),
    selectedDateRaw: booking.selectedDate,
    travelers: Number(booking.travelers) || 1,
    bookingType: booking.bookingType || "individual",
    leadTraveler: booking.leadTraveler || {},
    additionalTravelers: booking.additionalTravelers || [],
    groupDetails: booking.groupDetails,
    specialRequests: booking.specialRequests || "",
    dietaryNeeds: booking.dietaryNeeds || "",
    issuedAt: paymentData.paidAt || paymentData.updatedAt || new Date().toISOString(),
  };
}

function buildTravelerRows(leadTraveler, additionalTravelers) {
  const rows = [
    {
      label: "Lead traveler",
      name: `${leadTraveler?.firstName || ""} ${leadTraveler?.lastName || ""}`.trim(),
      email: leadTraveler?.email || "",
      phone: leadTraveler?.phone || "",
      nationality: leadTraveler?.nationality || "",
    },
    ...(additionalTravelers || []).map((traveler, index) => ({
      label: `Traveler ${index + 2}`,
      name: traveler.name || `${traveler.firstName || ""} ${traveler.lastName || ""}`.trim(),
      email: traveler.email || "",
      phone: traveler.phone || "",
      nationality: traveler.nationality || "",
    })),
  ];

  return rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.label)}</td>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.email)}</td>
          <td>${escapeHtml(row.phone)}</td>
          <td>${escapeHtml(row.nationality)}</td>
        </tr>
      `,
    )
    .join("");
}

export function buildPaymentReceiptHtml(data) {
  const {
    paymentReference,
    bookingRef,
    amountLabel,
    paidAt,
    tour,
    selectedDate,
    travelers,
    bookingType,
    leadTraveler,
    additionalTravelers = [],
    groupDetails,
    specialRequests,
    dietaryNeeds,
    issuedAt,
    bookingStatus,
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AfriQwest Payment Receipt — ${escapeHtml(paymentReference)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, "Times New Roman", serif; color: #1C2B26; background: #F7F3EB; padding: 32px 16px; }
    .receipt { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #E0D8C8; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(28,43,38,0.12); }
    .accent { height: 4px; background: linear-gradient(90deg, #2D5A47 0%, #E3A020 50%, #D4611A 100%); }
    .header { background: linear-gradient(135deg, #2D5A47 0%, #234839 100%); color: #fff; padding: 28px 32px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
    .header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.02em; }
    .header p { margin-top: 4px; font-size: 13px; opacity: 0.85; }
    .paid-badge { background: rgba(227,160,32,0.2); border: 1px solid rgba(227,160,32,0.45); color: #FFF8EB; font-family: Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 999px; }
    .refs { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ref { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; padding: 10px 14px; }
    .ref-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.8; font-family: Arial, sans-serif; }
    .ref-value { font-family: "Courier New", monospace; font-size: 15px; font-weight: 700; margin-top: 4px; letter-spacing: 0.06em; }
    .amount-strip { background: #FFF8EB; border-bottom: 1px solid #F0EBE0; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .amount-strip .label { font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #D4611A; font-weight: 700; }
    .amount-strip .value { font-size: 28px; font-weight: 700; color: #2D5A47; }
    .amount-strip .meta { font-family: Arial, sans-serif; font-size: 12px; color: #5A6B64; margin-top: 4px; }
    .notice { background: #EAF2EE; border-left: 4px solid #2D5A47; padding: 16px 20px; margin: 0; }
    .notice strong { display: block; color: #2D5A47; font-size: 14px; margin-bottom: 6px; font-family: Arial, sans-serif; }
    .notice p { font-size: 13px; line-height: 1.5; color: #5A6B64; }
    .body { padding: 28px 32px 32px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #D4611A; margin-bottom: 12px; font-family: Arial, sans-serif; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    table.info td { padding: 8px 0; vertical-align: top; border-bottom: 1px solid #F0EBE0; }
    table.info td:first-child { width: 38%; color: #5A6B64; font-family: Arial, sans-serif; }
    table.info td:last-child { font-weight: 600; }
    table.travelers { font-family: Arial, sans-serif; font-size: 12px; }
    table.travelers th { text-align: left; padding: 8px 10px; background: #F7F3EB; color: #5A6B64; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
    table.travelers td { padding: 10px; border-bottom: 1px solid #F0EBE0; vertical-align: top; }
    .status { display: inline-block; background: #EAF2EE; color: #2D5A47; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px; }
    .footer { border-top: 1px solid #E0D8C8; padding: 20px 32px; background: #FAFAF8; font-family: Arial, sans-serif; font-size: 11px; color: #5A6B64; line-height: 1.6; }
    .footer strong { color: #1C2B26; }
    @media print {
      body { background: #fff; padding: 0; }
      .receipt { box-shadow: none; border: none; border-radius: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="accent"></div>
    <div class="header">
      <div class="header-top">
        <div>
          <h1>AfriQwest Travel &amp; Tours</h1>
          <p>Official payment receipt</p>
        </div>
        <span class="paid-badge">Payment confirmed</span>
      </div>
      <div class="refs">
        <div class="ref">
          <div class="ref-label">Payment reference</div>
          <div class="ref-value">${escapeHtml(paymentReference)}</div>
        </div>
        <div class="ref">
          <div class="ref-label">Booking reference</div>
          <div class="ref-value">${escapeHtml(bookingRef)}</div>
        </div>
      </div>
    </div>

    <div class="amount-strip">
      <div>
        <div class="label">Amount paid</div>
        <div class="value">${escapeHtml(amountLabel)}</div>
        <div class="meta">Paid ${escapeHtml(formatReceiptDate(paidAt))}</div>
      </div>
      <div class="status">${escapeHtml(bookingStatus === "confirmed" ? "Booking confirmed" : "Paid in full")}</div>
    </div>

    <div class="notice">
      <strong>Present this receipt at check-in</strong>
      <p>Download or print this document and show it to AfriQwest staff or your tour guide upon arrival. It confirms your payment and booking details.</p>
    </div>

    <div class="body">
      <div class="section">
        <h2>Tour details</h2>
        <table class="info">
          <tr><td>Tour</td><td>${escapeHtml(tour.name)}</td></tr>
          <tr><td>Location</td><td>${escapeHtml(tour.location)}</td></tr>
          <tr><td>Country</td><td>${escapeHtml(tour.country)}</td></tr>
          <tr><td>Departure date</td><td>${escapeHtml(selectedDate)}</td></tr>
          <tr><td>Duration</td><td>${escapeHtml(tour.duration)}</td></tr>
          <tr><td>Travelers</td><td>${travelers}</td></tr>
          <tr><td>Booking type</td><td>${escapeHtml(bookingType === "group" ? "Group booking" : "Individual")}</td></tr>
          ${groupDetails?.groupName ? `<tr><td>Group</td><td>${escapeHtml(groupDetails.groupName)}</td></tr>` : ""}
          ${groupDetails?.groupType ? `<tr><td>Group type</td><td>${escapeHtml(groupDetails.groupType)}</td></tr>` : ""}
          ${dietaryNeeds ? `<tr><td>Dietary / accessibility</td><td>${escapeHtml(dietaryNeeds)}</td></tr>` : ""}
          ${specialRequests ? `<tr><td>Special requests</td><td>${escapeHtml(specialRequests)}</td></tr>` : ""}
          <tr><td>Issued</td><td>${escapeHtml(formatReceiptDate(issuedAt))}</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Traveler information</h2>
        <table class="travelers">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Nationality</th>
            </tr>
          </thead>
          <tbody>
            ${buildTravelerRows(leadTraveler, additionalTravelers)}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer">
      <strong>${escapeHtml(env.appName)}</strong><br />
      Email: ${escapeHtml(env.contactEmail)} · US: ${escapeHtml(env.contactPhoneUs)} · Ghana: ${escapeHtml(env.contactPhoneGh)}<br />
      ${escapeHtml(env.websiteUrl)}<br /><br />
      This receipt is your proof of payment. Keep it safe and present it at check-in.
      <p class="no-print" style="margin-top:16px;">
        <button onclick="window.print()" style="background:#2D5A47;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-size:13px;cursor:pointer;font-weight:600;">
          Save as PDF / Print
        </button>
      </p>
    </div>
  </div>
  <script class="no-print">
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 400);
    });
  </script>
</body>
</html>`;
}

export function downloadPaymentReceiptPdf(data) {
  const html = buildPaymentReceiptHtml(data);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!printWindow) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `AfriQwest-Payment-${data.paymentReference || data.bookingRef}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
