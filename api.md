# API Reference

**Base URL:** `https://api.merit.systems/v1`

**Authentication:** Include header `x-api-key: YOUR_API_KEY`

**Errors:** Standard HTTP status codes with `{status: number, message: string}` response

## Types

```typescript
interface Balance {
  raw_balance: string;
  formatted_balance: string;
}

interface PaginatedResponse<T> {
  items: T[];
  page_size: number;
  page: number;
  total_count: number;
  has_next: boolean;
}

interface OutgoingPayment {
  payer: string;
  recipient?: string;
  repoId?: string;
  claimStatus?: "deposited" | "claimed" | "reclaimed";
  claimDeadline?: string;
  eventType: "funded" | "payed";
  amount: string;
  token: string;
  timestamp: string;
  txHash: string;
}
```

## Repository Balance

### `GET /repos/{owner}/{repo}/balance`
Get repository balance by owner/repo name.

**Response:**
```typescript
interface RepoBalance {
  repo_id: number;
  owner: string;
  repo: string;
  balance: Balance;
}
```

### `GET /repositories/{repo_id}/balance`
Get repository balance by repository ID.

**Response:** `RepoBalance`

## User Balance

### `GET /users/{login}/balance`
Get user balance by GitHub login.

**Response:**
```typescript
interface UserBalance {
  user_id: number;
  login: string;
  balance: Balance;
}
```

### `GET /user/{user_id}/balance`
Get user balance by user ID.

**Response:** `UserBalance`

## User Payments

### `GET /user/{user_id}/payments`
Get paginated user payments.

**Query Parameters:**
- `page_size?: number` (default: 50, max: 100)
- `page?: number` (default: 1)

**Response:** `PaginatedResponse<OutgoingPayment>`