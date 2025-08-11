export type CheckoutItem = {
  id: number; // GitHub ID (user or repo)
  type: 'user' | 'repo';
  amount: number;
}

export type CheckoutParams = {
  items: CheckoutItem[];
  groupId?: string;
  senderGithubId?: number;
}

export type Amount = {
  raw: string;
  formatted: string;
}

export type UserBalance = {
  github_id: number;
  login: string;
  balance: Amount;
}

export type RepoBalance = {
  repo_id: number;
  owner: string;
  repo: string;
  balance: Amount;
}


export type UserPayment = {
  type: 'UserPayment';
  recipient_id: number;
}

export type RepoPayment = {
  type: 'RepoFund';
  repo_id: number;
}

export type OutgoingPayment = {
  sender_id: number;
  amount: Amount;
  token: string;
  timestamp: string;
  tx_hash: string;
  group_id?: string;
} & (UserPayment | RepoPayment);

export type OutgoingUserPaymentsParams = {
  group_id?: string;
  page_size?: number;
  page?: number;
}

export type PaginatedResponse<T> = {
  items: T[];
  page_size: number;
  page: number;
  total_count: number;
  has_next: boolean;
};

export type MeritAPIError = {
  status: number;
  message: string;
  request_id: string;
}

export type MeritSDKConfig = {
  apiKey: string;
  baseURL?: string;
  checkoutURL?: string;
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


export class MeritError extends Error {
  status: number;
  requestId: string;

  constructor(error:MeritAPIError) {
    super(error.message);
    this.name = 'MeritError';
    this.status = error.status;
    this.requestId = error.request_id;
  }
}