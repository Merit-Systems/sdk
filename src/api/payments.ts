import { MeritError, type OutgoingPayment, type OutgoingUserPaymentsParams, type PaginatedResponse } from '../types.js';
import { BaseAPI } from './base.js';

export class PaymentsAPI extends BaseAPI {
  /**
   * Get payments sent by a specific user
   * @param senderGithubId - The GitHub ID of the sender
   * @param params - Optional parameters for the payments query
   * @param params.groupId - Filter by specific group ID (UUID)
   * @param params.page_size - Maximum number of results to return [default = 50]
   * @param params.page - Number of results to skip (for pagination) [default = 1]
   * @returns Promise resolving to array of payments
   * @throws MeritError if API request fails
   * @example
   * ```typescript
   * // Get all payments sent by user
   * const payments = await sdk.payments.getPaymentsBySender(583231);
   *
   * // Get payments in a specific group
   * const groupPayments = await sdk.payments.getPaymentsBySender(583231, {
   *   groupId: 'uuid-group-id',
   *   limit: 10
   * });
   * ```
   */
  async getPaymentsBySender(
    senderGithubId: number,
    params?: OutgoingUserPaymentsParams,
  ): Promise<PaginatedResponse<OutgoingPayment>> {
    const queryParams = new URLSearchParams();
    if (params?.group_id) queryParams.append('group_id', params.group_id);
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const endpoint = `/user/${senderGithubId}/payments${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await this.request<PaginatedResponse<OutgoingPayment>>(endpoint);

    if (!response.success) {
      throw new MeritError(response.error);
    }

    return response.data;
  }
}
