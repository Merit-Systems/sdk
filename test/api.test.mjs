#!/usr/bin/env node

/**
 * API Integration tests for Merit SDK
 * Tests real API endpoints with actual API key
 *
 * Usage:
 *   MERIT_API_KEY=your_key_here node test/api.test.mjs
 *   OR
 *   node test/api.test.mjs your_api_key_here
 */

import {
  MeritError,
  MeritSDK,
  NotFoundError,
  UnauthorizedError,
} from '../dist/index.js';

// Get API key from environment or command line
const apiKey = process.env.MERIT_API_KEY || process.argv[2];
const baseURL =
  process.env.MERIT_BASE_URL || 'https://staging-api.merit.systems/v1';

if (!apiKey) {
  console.log('❌ API key required. Provide it via:');
  console.log('   Environment: MERIT_API_KEY=your_key node test/api.test.mjs');
  console.log('   Command line: node test/api.test.mjs your_api_key');
  console.log('');
  console.log(
    'Optional: Set base URL via MERIT_BASE_URL (defaults to staging-api.merit.systems)'
  );
  process.exit(1);
}

console.log('🔑 Testing Merit SDK with real API...');
console.log(`📡 Using API base URL: ${baseURL}`);
console.log(
  `🔍 Note: Staging API endpoints may not be fully implemented yet\n`
);

const merit = new MeritSDK({
  apiKey: apiKey,
  baseURL: baseURL,
});

let testsPassed = 0;
let testsFailed = 0;

async function runTest(testName, testFn) {
  try {
    console.log(`✅ ${testName}`);
    await testFn();
    console.log(`   ✓ Passed\n`);
    testsPassed++;
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    console.error(`   Error type: ${error.constructor.name}\n`);
    testsFailed++;
  }
}

// Test known GitHub users for balance checks
const TEST_GITHUB_LOGIN = 'rsproule'; // GitHub's mascot account
const TEST_GITHUB_ID = 24497652; // octocat's GitHub ID

async function main() {
  try {
    // Test 1: Balance by login (valid user)
    await runTest('Balance by GitHub login (valid user)', async () => {
      const balance =
        await merit.balances.getUserBalanceByLogin(TEST_GITHUB_LOGIN);
      console.log(`   Balance for ${TEST_GITHUB_LOGIN}:`, balance);

      if (!balance.login || !balance.user_id || balance.balance === undefined) {
        throw new Error('Invalid balance response structure');
      }
    });

    // Test 2: Balance by GitHub ID (valid user)
    await runTest('Balance by GitHub ID (valid user)', async () => {
      const balance =
        await merit.balances.getUserBalanceByGithubId(TEST_GITHUB_ID);
      console.log(`   Balance for ID ${TEST_GITHUB_ID}:`, balance);

      if (!balance.login || !balance.user_id || balance.balance === undefined) {
        throw new Error('Invalid balance response structure');
      }
    });

    // Test 3: Balance by login (invalid user)
    await runTest(
      'Balance by login (invalid user - should handle error)',
      async () => {
        try {
          await merit.balances.getUserBalanceByLogin(
            'this-user-definitely-does-not-exist-12345'
          );
          throw new Error('Expected error for invalid user');
        } catch (error) {
          if (error instanceof NotFoundError || error instanceof MeritError) {
            console.log(`   ✓ Correctly handled error: ${error.message}`);
          } else {
            throw error;
          }
        }
      }
    );

    // Test 4: Payments by sender (may return empty array)
    await runTest('Payments by sender', async () => {
      const payments = await merit.payments.getPaymentsBySender(
        TEST_GITHUB_ID,
        {
          page_size: 10,
          page: 1,
        }
      );
      console.log(`   Payments for sender ${TEST_GITHUB_ID}:`, payments);

      if (!payments.items || !Array.isArray(payments.items)) {
        throw new Error('Invalid payments response structure');
      }
      if (typeof payments.total_count !== 'number') {
        throw new Error('Missing total_count in payments response');
      }
    });

    // Test 5: Payments with group filter
    await runTest('Payments by sender with group filter', async () => {
      const payments = await merit.payments.getPaymentsBySender(
        TEST_GITHUB_ID,
        {
          group_id: 'fbb809b4-5359-4554-bfce-c0a8315bac4f',
          page_size: 5,
          page: 1,
        }
      );
      console.log(
        `   Payments for sender ${TEST_GITHUB_ID} with group filter:`,
        payments
      );

      if (!payments.items || !Array.isArray(payments.items)) {
        throw new Error('Invalid payments response structure');
      }
      if (typeof payments.total_count !== 'number') {
        throw new Error('Missing total_count in payments response');
      }
    });

    // Test 6: Test with bad API key
    await runTest('Bad API key handling', async () => {
      const badMerit = new MeritSDK({
        apiKey: 'invalid-api-key-12345',
        baseURL: baseURL,
      });

      try {
        await badMerit.balances.getUserBalanceByLogin(TEST_GITHUB_LOGIN);
        throw new Error('Expected unauthorized error');
      } catch (error) {
        if (error instanceof UnauthorizedError || error instanceof MeritError) {
          console.log(
            `   ✓ Correctly handled bad API key: ${error.message} (${error.constructor.name})`
          );
        } else {
          throw new Error(
            `Expected UnauthorizedError or MeritError, got: ${error.constructor.name}`
          );
        }
      }
    });
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    testsFailed++;
  }

  // Summary
  console.log('🏁 Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);

  if (testsFailed > 0) {
    console.log('\n⚠️  Some tests failed. This might be due to:');
    console.log('   - Staging API endpoints not yet implemented');
    console.log('   - Invalid API key');
    console.log('   - Different API structure in staging vs production');
    console.log('   - Network connectivity issues');
    console.log('   - API service unavailability');

    if (baseURL.includes('staging')) {
      console.log('\n💡 Try testing against production API:');
      console.log(
        '   MERIT_BASE_URL=https://api.merit.systems/v1 pnpm run test:api your_api_key'
      );
    }

    process.exit(1);
  } else {
    console.log('\n🎉 All API tests passed!');
  }
}

main().catch(error => {
  console.error('❌ Test runner crashed:', error);
  process.exit(1);
});
