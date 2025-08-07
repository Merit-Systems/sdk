export interface UserBalance {
  githubId: number;
  login: string;
  balance: number;
  currency: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  sender: {
    githubId: number;
    login: string;
  };
  receiver: {
    githubId: number;
    login: string;
  };
  groupId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface CheckoutItem {
  id: number; // GitHub ID (user or repo)
  type: 'user' | 'repo';
  amount: number;
}

export interface CheckoutParams {
  items: CheckoutItem[];
  groupId?: string;
  senderGithubId?: number;
}

export interface PaymentsFilter {
  groupId?: string;
  limit?: number;
  offset?: number;
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
