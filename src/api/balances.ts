import { type RepoBalance, type UserBalance } from '../types.js';
import { BaseAPI } from './base.js';

export class BalancesAPI extends BaseAPI {
  /**
   * Get user balance by GitHub login/username
   * @param login - The GitHub username (e.g., 'octocat')
   * @returns Promise resolving to user balance information
   * @throws MeritError if the user is not found or API request fails
   * @example
   * ```typescript
   * const userBalance = await sdk.balances.getUserBalanceByLogin('octocat');
   * console.log(`${userBalance.login} has ${userBalance.balance.formatted}`);
   * console.log(`${userBalance.login} has ${userBalance.balance.raw}`);
   * ```
   */
  async getUserBalanceByLogin(login: string): Promise<UserBalance> {
    const response = await this.request<UserBalance>(`/users/${login}/balance`);

    return response;
  }

  /**
   * Get user balance by GitHub ID
   * @param githubId - The GitHub user ID (64-bit integer, e.g., 583231)
   * @returns Promise resolving to user balance information
   * @throws MeritError if the user is not found or API request fails
   * @example
   * ```typescript
   * const userBalance = await sdk.balances.getUserBalanceByGithubId(583231);
   * console.log(`User ${userBalance.githubId} has ${userBalance.balance.formatted}`);
   * console.log(`User ${userBalance.login} has ${userBalance.balance.raw}`);
   * ```
   */
  async getUserBalanceByGithubId(githubId: number): Promise<UserBalance> {
    const response = await this.request<UserBalance>(
      `/user/${githubId}/balance`
    );

    return response;
  }

  /**
   * Get repository balance by owner and repository name
   * @param owner - The owner of the repository (e.g., 'octocat')
   * @param repo - The name of the repository (e.g., 'hello-world')
   * @returns Promise resolving to repository balance information
   * @throws MeritError if the repository is not found or API request fails
   * @example
   * ```typescript
   * const repoBalance = await sdk.balances.getRepoBalanceByName('octocat', 'hello-world');
   * console.log(`Repository ${repoBalance.repoId} has ${repoBalance.balance.formatted}`);
   * console.log(`Repository ${repoBalance.owner}/${repoBalance.repo} has ${repoBalance.balance.raw}`);
   * ```
   */
  async getRepoBalanceByName(
    owner: string,
    repo: string
  ): Promise<RepoBalance> {
    const response = await this.request<RepoBalance>(
      `/repos/${owner}/${repo}/balance`
    );

    return response;
  }

  /**
   * Get repository balance by repository ID
   * @param githubId - The GitHub repository ID (64-bit integer, e.g., 123456)
   * @returns Promise resolving to repository balance information
   * @throws MeritError if the repository is not found or API request fails
   * @example
   * ```typescript
   * const repoBalance = await sdk.balances.getRepoBalanceByRepoId(123456);
   * console.log(`Repository ${repoBalance.repoId} has ${repoBalance.balance.formatted}`);
   * console.log(`Repository ${repoBalance.owner}/${repoBalance.repo} has ${repoBalance.balance.raw}`);
   * ```
   */
  async getRepoBalanceByRepoId(githubId: number): Promise<RepoBalance> {
    const response = await this.request<RepoBalance>(
      `/repositories/${githubId}/balance`
    );

    return response;
  }
}
