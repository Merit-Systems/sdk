# Merit Systems SDK

A TypeScript SDK for interacting with the Merit Systems API. Built with modern TypeScript, full type safety, and comprehensive error handling.

## 🚀 Installation

```bash
npm install @merit-systems/sdk
# or
pnpm add @merit-systems/sdk
# or
yarn add @merit-systems/sdk
```

## 📋 Requirements

- Node.js 18+ (for native `fetch` support)
- TypeScript 5.0+ (optional, but recommended)

## 🔧 Quick Start

```typescript
import { MeritSDK } from '@merit-systems/sdk';

const sdk = new MeritSDK({
  apiKey: 'your-api-key',
  baseURL: 'https://api.merit.systems' // optional
});

// Get user balance by GitHub login
const balance = await sdk.balances.getBalanceByLogin('username');
console.log(`Balance: ${balance.balance} ${balance.currency}`);
```

## 📚 API Reference

### Balances API

#### Get Balance by GitHub Login
```typescript
const balance = await sdk.balances.getBalanceByLogin('github-username');
// Returns: { githubId: number, login: string, balance: number, currency: string }
```

#### Get Balance by GitHub ID
```typescript
const balance = await sdk.balances.getBalanceByGithubId(12345678);
// Returns: { githubId: number, login: string, balance: number, currency: string }
```

### Payments API

#### Get Payments by Sender
```typescript
const payments = await sdk.payments.getPaymentsBySender(12345678, {
  groupId: 'uuid-group-id',    // optional
  status: 'completed',         // optional: 'pending' | 'completed' | 'failed'
  limit: 10,                   // optional
  offset: 0                    // optional
});
```

#### Get Payments by Receiver
```typescript
const payments = await sdk.payments.getPaymentsByReceiver(87654321, {
  status: 'completed',         // optional
  limit: 10,                   // optional
  offset: 0                    // optional
});
```

### Checkout API

#### Create Checkout Link
```typescript
const checkout = await sdk.checkout.createCheckoutLink({
  amount: 100,
  currency: 'USD',             // optional, defaults to USD
  receiverGithubId: 12345678,
  senderGithubId: 87654321,    // optional
  groupId: 'custom-uuid',      // optional
  expiresInHours: 24,          // optional
  description: 'Payment for...' // optional
});

console.log(`Checkout URL: ${checkout.url}`);
```

#### Create Checkout Link with Auto-Generated Group ID
```typescript
const checkout = await sdk.checkout.createCheckoutLinkWithGroup({
  amount: 100,
  receiverGithubId: 12345678,
  senderGithubId: 87654321
});
// Group ID is automatically generated
```

#### Generate Group ID
```typescript
const groupId = sdk.checkout.generateGroupId();
// Use this UUID for multiple related checkout links
```

## 🔗 Data Types

### UserBalance
```typescript
interface UserBalance {
  githubId: number;    // GitHub user ID (64-bit integer)
  login: string;       // GitHub username
  balance: number;     // Current balance
  currency: string;    // Currency code (e.g., 'USD')
}
```

### Payment
```typescript
interface Payment {
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
```

### CheckoutLink
```typescript
interface CheckoutLink {
  id: string;
  url: string;
  amount: number;
  currency: string;
  receiverGithubId: number;
  senderGithubId?: number;
  groupId?: string;
  expiresAt: string;
  status: 'active' | 'completed' | 'expired';
}
```

## ⚠️ Error Handling

The SDK throws descriptive errors for API failures:

```typescript
try {
  const balance = await sdk.balances.getBalanceByLogin('nonexistent-user');
} catch (error) {
  if (error instanceof Error) {
    console.error('Merit API Error:', error.message);
  }
}
```

All API methods return typed responses with proper error handling built-in.

## 🔄 Environment Compatibility

- **Node.js 18+**: Native `fetch` support
- **React/Next.js**: Full browser compatibility
- **TypeScript**: Complete type safety
- **ESM/CJS**: Modern module formats

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm run build

# Run type checking
pnpm run typecheck

# Run linting
pnpm run lint

# Format code
pnpm run format

# Run all checks
pnpm run check

# Fix formatting and linting
pnpm run fix
```

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm run fix` to format and lint
5. Submit a pull request

All contributions are welcome!