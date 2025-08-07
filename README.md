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

// TODO when api is finalized