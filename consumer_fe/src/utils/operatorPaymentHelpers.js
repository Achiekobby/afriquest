import { formatBookingCurrency } from "./bookingHelpers";
import { parsePaginatedList } from "./adminPaginationHelpers";
import { mapApiPayment } from "./paymentHelpers";
import { mapOperatorBooking } from "./operatorBookingHelpers";

export const OPERATOR_PAYMENT_METHOD = {
  online: { label: "Online", className: "bg-brand-green/10 text-brand-green ring-brand-green/20" },
  onsite: { label: "On site", className: "bg-brand-gold/15 text-brand-orange ring-brand-gold/30" },
};

export function getOperatorPaymentMethodConfig(payment) {
  const key = String(payment?.paymentMethod || "").toLowerCase();
  return OPERATOR_PAYMENT_METHOD[key] || {
    label: key || "—",
    className: "bg-brand-muted/10 text-brand-muted ring-brand-border",
  };
}

export function mapOperatorPayment(raw) {
  const payment = mapApiPayment(raw);
  if (!payment) return null;

  const booking = raw.booking ? mapOperatorBooking(raw.booking) : null;
  const resolvedAmount = booking?.subtotal ?? payment.amount;
  const traveler = booking?.leadTraveler || raw.booking?.leadTraveler || {};

  return {
    ...payment,
    paymentMethod: raw.paymentMethod || payment.paymentMethod || "online",
    amount: resolvedAmount,
    amountLabel: formatBookingCurrency(resolvedAmount, payment.currency),
    tourName: booking?.tour?.name || raw.booking?.tour?.name || "Tour booking",
    tourImage: booking?.tour?.image || raw.booking?.tour?.coverImageUrl || "",
    travelerName: `${traveler.firstName || ""} ${traveler.lastName || ""}`.trim(),
    booking,
  };
}

export function mapOperatorPaymentList(data) {
  const { items, pagination } = parsePaginatedList(data);
  return {
    items: items.map(mapOperatorPayment).filter(Boolean),
    pagination,
  };
}

export function summarizeOperatorPayments(payments = []) {
  let paidTotal = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let onsiteCount = 0;

  payments.forEach((payment) => {
    if (payment.status === "paid") {
      paidCount += 1;
      paidTotal += Number(payment.amount) || 0;
    }
    if (payment.status === "pending") pendingCount += 1;
    if (payment.paymentMethod === "onsite") onsiteCount += 1;
  });

  return {
    paidTotal,
    paidTotalLabel: formatBookingCurrency(paidTotal, payments[0]?.currency || "GHS"),
    paidCount,
    pendingCount,
    onsiteCount,
  };
}
