const STORAGE_KEY = "afriqwest_bookings";

export function getBookingStatus(booking) {
  if (booking.paymentMode === "online") return "paid";
  if (booking.paymentMode === "onsite") return "pay_onsite";
  if (booking.paymentMode === "now") {
    return booking.payType === "full" ? "paid" : "deposit_paid";
  }
  return "reserved";
}

export function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking) {
  const record = {
    ...booking,
    status: getBookingStatus(booking),
    savedAt: new Date().toISOString(),
  };
  const existing = getBookings();
  const updated = [record, ...existing.filter((b) => b.bookingRef !== record.bookingRef)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("afriqwest:bookings-updated"));
  return record;
}

export function parseDepartureDate(dateStr) {
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

export function isUpcoming(booking) {
  const dep = parseDepartureDate(booking.selectedDate);
  if (!dep) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dep >= today;
}
