#!/usr/bin/env node

/**
 * Basic integration test to verify the SDK builds and works correctly
 * Tests core functionality: SDK instantiation and checkout URL generation
 */

import { MeritSDK } from '../dist/index.js';

console.log('🧪 Testing Merit SDK...\n');

try {
  // Test 1: SDK instantiation
  console.log('✅ Test 1: SDK instantiation');
  const merit = new MeritSDK({
    apiKey: 'test-api-key-12345',
  });
  console.log('   ✓ SDK instance created successfully');

  // Test 2: Checkout URL generation - single user
  console.log('\n✅ Test 2: Single user checkout URL');
  const userCheckoutUrl = merit.checkout.generateCheckoutUrl([
    { id: 583231, type: 'user', amount: 50.0 },
  ]);
  console.log('   ✓ User checkout URL:', userCheckoutUrl);

  // Verify URL structure
  const userUrl = new URL(userCheckoutUrl);
  if (userUrl.hostname !== 'terminal.merit.systems') {
    throw new Error('Invalid hostname in checkout URL');
  }
  if (!userUrl.searchParams.get('items')) {
    throw new Error('Missing items parameter in checkout URL');
  }
  if (!userUrl.searchParams.get('groupId')) {
    throw new Error('Missing groupId parameter in checkout URL');
  }
  console.log('   ✓ URL structure validation passed');

  // Test 3: Checkout URL generation - multiple items
  console.log('\n✅ Test 3: Multiple items checkout URL');
  const multiCheckoutUrl = merit.checkout.generateCheckoutUrl([
    { id: 583231, type: 'user', amount: 25.0 },
    { id: 123456, type: 'repo', amount: 75.0 },
  ]);
  console.log('   ✓ Multi-item checkout URL:', multiCheckoutUrl);

  // Test 4: Custom group ID
  console.log('\n✅ Test 4: Custom group ID');
  const customGroupId = 'my-custom-group-2024';
  const customGroupUrl = merit.checkout.generateCheckoutUrl(
    [{ id: 583231, type: 'user', amount: 100.0 }],
    customGroupId
  );
  console.log('   ✓ Custom group checkout URL:', customGroupUrl);

  // Verify custom group ID is used
  const customUrl = new URL(customGroupUrl);
  if (customUrl.searchParams.get('groupId') !== customGroupId) {
    throw new Error('Custom group ID not used correctly');
  }
  console.log('   ✓ Custom group ID validation passed');

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
  const items = JSON.parse(testUrl.searchParams.get('items'));
  if (!Array.isArray(items) || items.length !== 1) {
    throw new Error('Invalid items encoding');
  }
  if (items[0] !== 'u_583231_50.00') {
    throw new Error('Invalid item encoding format');
  }
  console.log('   ✓ Items parameter correctly encoded:', items);

  console.log('\n🎉 All tests passed! SDK is working correctly.\n');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error('Error details:', error);
  process.exit(1);
}
