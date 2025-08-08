# Merit Systems SDK

A minimal TypeScript SDK for interacting with the Merit Systems API.

## Installation

```bash
npm install @merit-systems/sdk
# or
pnpm add @merit-systems/sdk
# or
yarn add @merit-systems/sdk
```

## Requirements

- Node.js 18+ (for native `fetch` support)
- TypeScript 5.0+ (optional, but recommended)

## Quick Start

```typescript
import { MeritSDK } from '@merit-systems/sdk';

const merit = new MeritSDK({
  apiKey: 'your-api-key',
  baseURL: 'https://api.merit.systems' // optional
});

// Get user balance by GitHub login
const balance = await merit.balances.getBalanceByLogin('username');
console.log(`Balance: ${balance.balance} ${balance.currency}`);
```

## API Reference



### Base URL

```
https://api.merit.systems/v1
```

### Authentication

All API requests require an API key to be included in the request headers:

```typescript
const headers = {
  "x-api-key": "YOUR_API_KEY",
};
```

### Error Responses

All endpoints may return the following error responses:

#### Error Response Format

```typescript
interface ErrorResponse {
  status: number;
  message: string;
}
```

#### HTTP Status Codes

- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid API key
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Types

#### Balance

```typescript
interface Balance {
  raw_balance: string; // Raw balance value (e.g., "123456789")
  formatted_balance: string; // Human-readable balance (e.g., "123.45")
}
```

#### Pagination Parameters

```typescript
interface PaginationParams {
  page_size?: number; // Number of items per page (default: 50, max: 100)
  page?: number; // Page number (default: 1)
}
```

#### Paginated Response

```typescript
interface PaginatedResponse<T> {
  items: T[];
  page_size: number;
  page: number;
  total_count: number;
  has_next: boolean;
}
```

#### Outgoing Payment Types

```typescript
enum OutgoingPaymentClaimStatus {
  Deposited = "deposited",
  Claimed = "claimed",
  Reclaimed = "reclaimed",
}

enum OutgoingPaymentEventType {
  Funded = "funded",
  Payed = "payed",
}

interface OutgoingPayment {
  payer: string;
  recipient?: string;
  repoId?: string;
  claimStatus?: OutgoingPaymentClaimStatus;
  claimDeadline?: string;
  eventType: OutgoingPaymentEventType;
  amount: string;
  token: string;
  timestamp: string;
  txHash: string;
}
```

### Endpoints

#### Repository Balance

##### Get Repository Balance by Owner/Repo Name

Retrieves the balance for a specific repository using the owner and repository name.

**Endpoint:** `GET /repos/{owner}/{repo}/balance`

**Path Parameters:**

- `owner` (string) - Repository owner (e.g., "facebook")
- `repo` (string) - Repository name (e.g., "react")

**Response:**

```typescript
interface RepoBalance {
  repo_id: number;
  owner: string;
  repo: string;
  balance: Balance;
}
```

**Example Request:**

```typescript
const response = await fetch(
  "https://api.merit.systems/v1/repos/facebook/react/balance",
  {
    method: "GET",
    headers: {
      "x-api-key": "YOUR_API_KEY",
    },
  }
);

const repoBalance: RepoBalance = await response.json();
```

**Example Response:**

```json
{
  "repo_id": 10270250,
  "owner": "facebook",
  "repo": "react",
  "balance": {
    "raw_balance": "123456789",
    "formatted_balance": "123.45"
  }
}
```

##### Get Repository Balance by Repository ID

Retrieves the balance for a specific repository using the repository ID.

**Endpoint:** `GET /repositories/{repo_id}/balance`

**Path Parameters:**

- `repo_id` (number) - GitHub repository ID

**Response:** Same as above (`RepoBalance`)

**Example Request:**

```typescript
const response = await fetch(
  "https://api.merit.systems/v1/repositories/10270250/balance",
  {
    method: "GET",
    headers: {
      "x-api-key": "YOUR_API_KEY",
    },
  }
);

const repoBalance: RepoBalance = await response.json();
```

#### User Balance

##### Get User Balance by Login

Retrieves the balance for a specific user using their GitHub login.

**Endpoint:** `GET /users/{login}/balance`

**Path Parameters:**

- `login` (string) - GitHub username (e.g., "gaearon")

**Response:**

```typescript
interface UserBalance {
  user_id: number;
  login: string;
  balance: Balance;
}
```

**Example Request:**

```typescript
const response = await fetch(
  "https://api.merit.systems/v1/users/gaearon/balance",
  {
    method: "GET",
    headers: {
      "x-api-key": "YOUR_API_KEY",
    },
  }
);

const userBalance: UserBalance = await response.json();
```

**Example Response:**

```json
{
  "user_id": 810438,
  "login": "gaearon",
  "balance": {
    "raw_balance": "987654321",
    "formatted_balance": "987.65"
  }
}
```

##### Get User Balance by User ID

Retrieves the balance for a specific user using their GitHub user ID.

**Endpoint:** `GET /user/{user_id}/balance`

**Path Parameters:**

- `user_id` (number) - GitHub user ID

**Response:** Same as above (`UserBalance`)

**Example Request:**

```typescript
const response = await fetch(
  "https://api.merit.systems/v1/user/810438/balance",
  {
    method: "GET",
    headers: {
      "x-api-key": "YOUR_API_KEY",
    },
  }
);

const userBalance: UserBalance = await response.json();
```

#### User Payments

##### Get User Payments

Retrieves a paginated list of outgoing payments for a specific user.

**Endpoint:** `GET /user/{user_id}/payments`

**Path Parameters:**

- `user_id` (number) - GitHub user ID

**Query Parameters:**

- `page_size` (optional, number) - Number of items per page (default: 50, max: 100)
- `page` (optional, number) - Page number (default: 1)

**Response:**

```typescript
PaginatedResponse<OutgoingPayment>;
```

**Example Request:**

```typescript
const response = await fetch(
  "https://api.merit.systems/v1/user/810438/payments?page_size=20&page=1",
  {
    method: "GET",
    headers: {
      "x-api-key": "YOUR_API_KEY",
    },
  }
);

const payments: PaginatedResponse<OutgoingPayment> = await response.json();
```

**Example Response:**

```json
{
  "items": [
    // Payment to a Repo
    {
      "payer": "810438",
      "recipient": null,
      "repoId": "10270250",
      "claimStatus": null,
      "claimDeadline": null,
      "eventType": "funded",
      "amount": "250.00",
      "token": "USDC",
      "timestamp": "2024-01-08T14:30:00Z",
      "txHash": "0xabcdef1234567890..."
    },
    // Payment to a github user
    {
      "payer": "810438",
      "recipient": "456789",
      "repoId": null,
      "claimStatus": "deposited",
      "claimDeadline": "2024-02-01T00:00:00Z",
      "eventType": "payed",
      "amount": "75.25",
      "token": "USDC",
      "timestamp": "2024-01-05T09:15:00Z",
      "txHash": "0x1234567890abcdef..."
    }
  ],
  "page_size": 20,
  "page": 1,
  "total_count": 45,
  "has_next": true
}
```
