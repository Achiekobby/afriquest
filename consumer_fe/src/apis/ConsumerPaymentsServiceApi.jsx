import axios from "axios";
import env from "../config/env";
import { mapApiPaymentToListRecord, getLatestPendingPayment, extractPaymentRedirectUrl } from "../utils/paymentHelpers";
import { parseApiEnvelope, parseApiError } from "../utils/apiResponse";
import { parsePaginatedList } from "../utils/adminPaginationHelpers";

class ConsumerPaymentsServiceApi {
  constructor() {
    this.baseUrl = env.apiUrl;
  }

  getHeaders(token) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async listPayments(token, { page = 1, per_page = 15 } = {}) {
    const url = `${this.baseUrl}/client/payments`;

    try {
      const response = await axios.get(url, {
        headers: this.getHeaders(token),
        params: { page, per_page },
      });
      const result = parseApiEnvelope(response);
      if (!result.ok) return { ...result, items: [], pagination: null };

      const { items, pagination } = parsePaginatedList(result.data);

      return {
        ...result,
        items: items.map(mapApiPaymentToListRecord).filter(Boolean),
        pagination,
      };
    } catch (error) {
      return { ...parseApiError(error), items: [], pagination: null };
    }
  }

  async getPayment(token, paymentSlug) {
    const url = `${this.baseUrl}/client/payments/${encodeURIComponent(paymentSlug)}`;

    try {
      const response = await axios.get(url, { headers: this.getHeaders(token) });
      const result = parseApiEnvelope(response);
      if (!result.ok) return { ...result, payment: null };

      const payment = mapApiPaymentToListRecord(result.data);

      return {
        ...result,
        payment,
      };
    } catch (error) {
      return { ...parseApiError(error), payment: null };
    }
  }

  async retryPayment(token, paymentSlug) {
    const url = `${this.baseUrl}/client/payments/${encodeURIComponent(paymentSlug)}/retry`;

    try {
      const response = await axios.post(url, {}, { headers: this.getHeaders(token) });
      const result = parseApiEnvelope(response);
      if (!result.ok) return { ...result, payment: null, paymentUrl: null };

      const payment = mapApiPaymentToListRecord(result.data);

      return {
        ...result,
        payment,
        paymentUrl: extractPaymentRedirectUrl({ payment, paymentUrl: result.data?.paymentUrl }),
      };
    } catch (error) {
      return { ...parseApiError(error), payment: null, paymentUrl: null };
    }
  }

  async verifyPayment(reference) {
    const url = `${this.baseUrl}/payment/verify`;

    try {
      const response = await axios.get(url, {
        params: { ref: reference },
        headers: { Accept: "application/json" },
      });
      const result = parseApiEnvelope(response);
      if (!result.ok) return { ...result, payment: null, verified: false };

      const payment = mapApiPaymentToListRecord(result.data);
      const verified = payment?.status === "paid";

      return {
        ...result,
        verified,
        payment,
      };
    } catch (error) {
      return { ...parseApiError(error), payment: null, verified: false };
    }
  }

  async retryPaymentForBooking(token, bookingCode) {
    const listResult = await this.listPayments(token, { page: 1, per_page: 50 });
    if (!listResult.ok) {
      return { ...listResult, payment: null, paymentUrl: null };
    }

    const pending = getLatestPendingPayment(listResult.items, bookingCode);

    if (!pending?.paymentSlug) {
      return {
        ok: false,
        reason: "No pending payment found for this booking.",
        message: "No pending payment found for this booking.",
        payment: null,
        paymentUrl: null,
      };
    }

    return this.retryPayment(token, pending.paymentSlug);
  }
}

const consumerPaymentsServiceApi = new ConsumerPaymentsServiceApi();
export default consumerPaymentsServiceApi;
