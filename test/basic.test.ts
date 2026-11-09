#!/usr/bin/env node

/**
 * Basic integration test to verify the SDK builds and works correctly
 * Tests core functionality: SDK instantiation and checkout URL generation
 */

import { MeritSDK } from '../src/index.js';

console.log('🧪 Testing Merit SDK...\n');

try {
  // Test 1: SDK instantiation
  console.log('✅ Test 1: SDK instantiation');
  const merit = new MeritSDK({
    apiKey: 'test-api-key-12345',
  });
  console.log('   ✓ SDK instance created successfully');

  // Test 2: Checkout URL generation - single user (new API)
  console.log('\n✅ Test 2: Single user checkout URL (new API)');
  const userCheckoutUrl = merit.checkout.generateCheckoutUrl({
    items: [{ id: 583231, type: 'user', amount: 50.0 }],
  });
  console.log('   ✓ User checkout URL:', userCheckoutUrl);

  // Verify URL structure
  const userUrl = new URL(userCheckoutUrl);
  if (userUrl.hostname !== 'terminal.merit.systems') {
    throw new Error('Invalid hostname in checkout URL');
  }
  if (!userUrl.searchParams.get('recipients')) {
    throw new Error('Missing recipients parameter in checkout URL');
  }
  if (!userUrl.searchParams.get('groupId')) {
    throw new Error('Missing groupId parameter in checkout URL');
  }
  console.log('   ✓ URL structure validation passed');

  // Test 3: Checkout URL generation - multiple items with sender
  console.log('\n✅ Test 3: Multiple items checkout URL with sender');
  const multiCheckoutUrl = merit.checkout.generateCheckoutUrl({
    items: [
      { id: 583231, type: 'user', amount: 25.0 },
      { id: 123456, type: 'repo', amount: 75.0 },
    ],
    senderGithubId: 987654,
  });
  console.log('   ✓ Multi-item checkout URL:', multiCheckoutUrl);

  // Verify sender parameter is included
  const multiUrl = new URL(multiCheckoutUrl);
  if (multiUrl.searchParams.get('sender') !== '987654') {
    throw new Error('Sender parameter not included correctly');
  }
  console.log('   ✓ Sender parameter validation passed');

  // Test 4: Custom group ID (new API)
  console.log('\n✅ Test 4: Custom group ID with new API');
  const customGroupId = 'my-custom-group-2024';
  const customGroupUrl = merit.checkout.generateCheckoutUrl({
    items: [{ id: 583231, type: 'user', amount: 100.0 }],
    groupId: customGroupId,
    senderGithubId: 555444,
  });
  console.log('   ✓ Custom group checkout URL:', customGroupUrl);

  // Verify custom group ID and sender are used
  const customUrl = new URL(customGroupUrl);
  if (customUrl.searchParams.get('groupId') !== customGroupId) {
    throw new Error('Custom group ID not used correctly');
  }
  if (customUrl.searchParams.get('sender') !== '555444') {
    throw new Error('Sender not included correctly');
  }
  console.log('   ✓ Custom group ID and sender validation passed');

  // Test 5: Auto-generated group ID
  console.log('\n✅ Test 5: Auto-generated group ID');
  const groupId = merit.checkout.generateGroupId();
  if (!groupId || typeof groupId !== 'string' || groupId.length < 10) {
    throw new Error('Invalid generated group ID');
  }
  console.log('   ✓ Generated group ID:', groupId);

  // Test 6: URL parameter parsing
  console.log('\n✅ Test 6: URL parameter validation');
  const testUrl = new URL(userCheckoutUrl);
  const recipientsString = testUrl.searchParams.get('recipients');
  if (!recipientsString) {
    throw new Error('Recipients parameter missing');
  }
  const recipients = recipientsString.split(',');
  if (!Array.isArray(recipients) || recipients.length !== 1) {
    throw new Error('Invalid recipients encoding');
  }
  if (recipients[0] !== 'u_583231_50.00') {
    throw new Error('Invalid recipient encoding format');
  }
  console.log('   ✓ Recipients parameter correctly encoded:', recipientsString);

  // Test 7: Reject invalid checkout item amounts
  console.log('\n✅ Test 7: Reject invalid checkout item amounts');
  const invalidAmounts = [0, -1, -50.25, NaN, Infinity, -Infinity];
  for (const amount of invalidAmounts) {
    let threw = false;
    try {
      merit.checkout.generateCheckoutUrl({
        items: [{ id: 583231, type: 'user', amount }],
      });
    } catch (err) {
      threw = true;
      if (
        !(err instanceof Error) ||
        !err.message.includes('Invalid checkout amount')
      ) {
        throw new Error(`Unexpected error message for amount ${amount}: ${err}`);
      }
    }
    if (!threw) {
      throw new Error(`Failed to reject invalid checkout amount: ${amount}`);
    }
  }
  console.log('   ✓ Rejected 0, negative, NaN, and Infinity amounts correctly');

  console.log('\n🎉 All tests passed! SDK is working correctly.\n');
} catch (error) {
  console.error(
    '\n❌ Test failed:',
    error instanceof Error ? error.message : String(error)
  );
  if (error instanceof Error) {
    console.error('Error details:', error);
  }
  process.exit(1);
}
