import type { MeritSDKConfig, UserBalance, APIResponse } from './types.js';

export class MeritSDK {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor(config: MeritSDKConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL ?? 'https://api.merit.systems';
  }

  async getUserBalance(githubId: string): Promise<UserBalance> {
    const response = await this.request<UserBalance>(
      `/users/${githubId}/balance`
    );

    if (!response.success) {
      throw new Error(`Merit API Error: ${response.error.message}`);
    }

    return response.data;
  }

  private async request<T>(endpoint: string): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: response.status.toString(),
            message: data.message ?? 'Unknown error occurred',
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message:
            error instanceof Error ? error.message : 'Network request failed',
        },
      };
    }
  }
}
