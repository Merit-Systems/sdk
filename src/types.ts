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
  githubId: number;
  login: string;
  balance: Amount;
}

export type RepoBalance = {
  repoId: number;
  owner: string;
  repo: string;
  balance: Amount;
}


export type UserPayment = {
  type: 'UserPayment';
  recipientId: number;
}

export type RepoPayment = {
  type: 'RepoFund';
  repoId: number;
}

export type OutgoingPayment = {
  senderId: number;
  amount: Amount;
  token: string;
  timestamp: string;
  txHash: string;
  groupId?: string;
} & (UserPayment | RepoPayment);

export type OutgoingUserPaymentsParams = {
  groupId?: string;
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
  requestId: string;
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
    this.requestId = error.requestId;
  }
}