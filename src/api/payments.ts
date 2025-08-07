import type { Payment, PaymentsFilter } from '../types.js';
import { BaseAPI } from './base.js';

export class PaymentsAPI extends BaseAPI {
  /**
   * Get payments sent by a specific user
   * @param senderGithubId - The GitHub ID of the sender
   * @param filter - Optional filters for the payments query
   * @param filter.groupId - Filter by specific group ID (UUID)
   * @param filter.status - Filter by payment status
   * @param filter.limit - Maximum number of results to return
   * @param filter.offset - Number of results to skip (for pagination)
   * @returns Promise resolving to array of payments
   * @throws Error if API request fails
   * @example
   * ```typescript
   * // Get all payments sent by user
   * const payments = await sdk.payments.getPaymentsBySender(583231);
   *
   * // Get completed payments in a specific group
   * const groupPayments = await sdk.payments.getPaymentsBySender(583231, {
   *   groupId: 'uuid-group-id',
   *   status: 'completed',
   *   limit: 10
   * });
   * ```
   */
  async getPaymentsBySender(
    senderGithubId: number,
    filter?: PaymentsFilter
  ): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (filter?.groupId) params.append('groupId', filter.groupId);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.offset) params.append('offset', filter.offset.toString());

    const queryString = params.toString();
    const endpoint = `/payments/sender/${senderGithubId}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await this.request<Payment[]>(endpoint);

    if (!response.success) {
      throw new Error(`Merit API Error: ${response.error.message}`);
    }

    return response.data;
  }

  /**
   * Get payments received by a specific user
   * @param receiverGithubId - The GitHub ID of the receiver
   * @param filter - Optional filters for the payments query
   * @param filter.status - Filter by payment status
   * @param filter.limit - Maximum number of results to return
   * @param filter.offset - Number of results to skip (for pagination)
   * @returns Promise resolving to array of payments
   * @throws Error if API request fails
   * @example
   * ```typescript
   * // Get all payments received by user
   * const payments = await sdk.payments.getPaymentsByReceiver(583231);
   *
   * // Get recent completed payments
   * const recentPayments = await sdk.payments.getPaymentsByReceiver(583231, {
   *   status: 'completed',
   *   limit: 5
   * });
   * ```
   */
  async getPaymentsByReceiver(
    receiverGithubId: number,
    filter?: Omit<PaymentsFilter, 'groupId'>
  ): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.offset) params.append('offset', filter.offset.toString());

    const queryString = params.toString();
    const endpoint = `/payments/receiver/${receiverGithubId}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await this.request<Payment[]>(endpoint);

    if (!response.success) {
      throw new Error(`Merit API Error: ${response.error.message}`);
    }

    return response.data;
  }
}
