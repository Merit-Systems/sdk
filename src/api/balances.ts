import type { UserBalance } from '../types.js';
import { BaseAPI } from './base.js';

export class BalancesAPI extends BaseAPI {
  /**
   * Get user balance by GitHub login/username
   * @param login - The GitHub username (e.g., 'octocat')
   * @returns Promise resolving to user balance information
   * @throws Error if the user is not found or API request fails
   * @example
   * ```typescript
   * const balance = await sdk.balances.getBalanceByLogin('octocat');
   * console.log(`${balance.login} has ${balance.balance} ${balance.currency}`);
   * ```
   */
  async getBalanceByLogin(login: string): Promise<UserBalance> {
    const response = await this.request<UserBalance>(`/users/${login}/balance`);

    if (!response.success) {
      throw new Error(`Merit API Error: ${response.error.message}`);
    }

    return response.data;
  }

  /**
   * Get user balance by GitHub ID
   * @param githubId - The GitHub user ID (64-bit integer, e.g., 583231)
   * @returns Promise resolving to user balance information
   * @throws Error if the user is not found or API request fails
   * @example
   * ```typescript
   * const balance = await sdk.balances.getBalanceByGithubId(583231);
   * console.log(`User ${balance.githubId} has ${balance.balance} ${balance.currency}`);
   * ```
   */
  async getBalanceByGithubId(githubId: number): Promise<UserBalance> {
    const response = await this.request<UserBalance>(
      `/users/github/${githubId}/balance`
    );

    if (!response.success) {
      throw new Error(`Merit API Error: ${response.error.message}`);
    }

    return response.data;
  }
}
