import { MeritSDK } from './dist/index.js';

// Test with localhost checkout URL
const merit = new MeritSDK({
  apiKey: 'test-key',
  checkoutURL: 'http://localhost:5174',
});

const checkoutUrl = merit.checkout.generateCheckoutUrl({
  items: [
    { id: 24497652, type: 'user', amount: 25.0 },
    { id: 642557888, type: 'repo', amount: 75.0 },
  ],
});

console.log('🔗 Localhost checkout URL:');
console.log(checkoutUrl);
