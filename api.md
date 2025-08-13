# API Reference

**Base URL:** `https://api.merit.systems/v1`

**Authentication:** Include header `x-api-key: YOUR_API_KEY`

**Errors:** Standard HTTP status codes with `{status: number, message: string, request_id?: string}` response

## Types

> **Source:** [`src/types.ts`](src/types.ts)

```typescript
interface Amount {
  raw: string;
  formatted: string;
}

interface PaginatedResponse<T> {
  items: T[];
  page_size: number;
  page: number;
  total_count: number;
  has_next: boolean;
}

interface UserPayment {
  type: 'UserPayment';
  recipient_id: number;
}

interface RepoPayment {
  type: 'RepoFund';
  repo_id: number;
}

interface OutgoingPayment {
  sender_id: number;
  amount: Amount;
  token: string;
  timestamp: string;
  tx_hash: string;
  group_id?: string;
} & (UserPayment | RepoPayment);

interface OutgoingUserPaymentsParams {
  group_id?: string;
  page_size?: number;
  page?: number;
}
```

## User Balance

> **Source:** [`src/api/balances.ts`](src/api/balances.ts)

### `GET /users/{login}/balance`
Get user balance by GitHub login.

> **Implementation:** [`getUserBalanceByLogin()`](src/api/balances.ts#L17-L21)

**Response:**
```typescript
interface UserBalance {
  user_id: number;
  login: string;
  balance: Amount;
}
```

### `GET /user/{user_id}/balance`
Get user balance by user ID.

> **Implementation:** [`getUserBalanceByGithubId()`](src/api/balances.ts#L35-L41)

**Response:** `UserBalance`

## Repository Balance

> **Source:** [`src/api/balances.ts`](src/api/balances.ts)

### `GET /repos/{owner}/{repo}/balance`
Get repository balance by owner/repo name.

> **Implementation:** [`getRepoBalanceByName()`](src/api/balances.ts#L56-L65)

**Response:**
```typescript
interface RepoBalance {
  repo_id: number;
  owner: string;
  repo: string;
  balance: Amount;
}
```

### `GET /repositories/{repo_id}/balance`
Get repository balance by repository ID.

> **Implementation:** [`getRepoBalanceByRepoId()`](src/api/balances.ts#L79-L85)

**Response:** `RepoBalance`

## User Payments

> **Source:** [`src/api/payments.ts`](src/api/payments.ts)

### `GET /user/{user_id}/payments`
Get paginated user payments sent by the user.

> **Implementation:** [`getPaymentsBySender()`](src/api/payments.ts#L30-L49)

**Query Parameters:**
- `group_id?: string` - Filter by specific group ID (UUID)
- `page_size?: number` - Maximum number of results to return (default: 50, max: 100)
- `page?: number` - Page number for pagination (default: 1)

**Response:** `PaginatedResponse<OutgoingPayment>`

## SDK Usage

### Balance APIs

> **Source:** [`src/api/balances.ts`](src/api/balances.ts)

```typescript
import { MeritSDK } from '@merit-systems/sdk';

const merit = new MeritSDK({
  apiKey: 'your-api-key'
});

// Get user balance by login
const userBalance = await merit.balances.getUserBalanceByLogin('octocat');
console.log(`${userBalance.login} has ${userBalance.balance.formatted}`);

// Get user balance by ID
const userBalance2 = await merit.balances.getUserBalanceByGithubId(583231);

// Get repo balance by name
const repoBalance = await merit.balances.getRepoBalanceByName('owner', 'repo');

// Get repo balance by ID
const repoBalance2 = await merit.balances.getRepoBalanceByRepoId(123456);
```

### Payments APIs

> **Source:** [`src/api/payments.ts`](src/api/payments.ts)

```typescript
// Get all payments sent by user
const payments = await merit.payments.getPaymentsBySender(583231);

// Get payments with pagination
const pagedPayments = await merit.payments.getPaymentsBySender(583231, {
  page_size: 10,
  page: 1
});

// Get payments filtered by group ID
const groupPayments = await merit.payments.getPaymentsBySender(583231, {
  group_id: 'uuid-group-id',
  page_size: 20
});
```

### Checkout APIs

> **Source:** [`src/api/checkout.ts`](src/api/checkout.ts)

```typescript
// Generate checkout URL
const checkoutUrl = merit.checkout.generateCheckoutUrl({
  items: [
    { id: 583231, type: 'user', amount: 50.0 },
    { id: 123456, type: 'repo', amount: 25.0 }
  ],
  groupId: 'optional-custom-group-id', // auto-generated if not provided
  senderGithubId: 987654 // optional
});

// Generate a group ID
const groupId = merit.checkout.generateGroupId();
```

## Error Handling

> **Source:** [`src/types.ts`](src/types.ts#L86-L131) | **Implementation:** [`src/api/base.ts`](src/api/base.ts#L51-L82)

The SDK throws specific error types for different HTTP status codes:

```typescript
import { 
  UnauthorizedError, 
  NotFoundError, 
  BadRequestError,
  InternalServerError,
  MeritError 
} from '@merit-systems/sdk';

try {
  const balance = await merit.balances.getUserBalanceByLogin('nonexistent');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('User not found');
  } else if (error instanceof UnauthorizedError) {
    console.log('Invalid API key');
  } else if (error instanceof MeritError) {
    console.log(`API error: ${error.message}`);
  }
}
```