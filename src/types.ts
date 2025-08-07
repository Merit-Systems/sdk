export interface UserBalance {
  githubId: string;
  balance: number;
  currency: string;
}

export interface MeritAPIError {
  code: string;
  message: string;
}

export interface MeritSDKConfig {
  apiKey: string;
  baseURL?: string;
}

export type APIResponse<T> =
  | {
      data: T;
      success: true;
    }
  | {
      error: MeritAPIError;
      success: false;
    };
