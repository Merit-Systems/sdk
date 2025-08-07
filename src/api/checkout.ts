import { v4 as uuidv4 } from 'uuid';
import type { CheckoutItem } from '../types.js';

export class CheckoutAPI {
  private readonly baseCheckoutURL: string;

  constructor(
    baseCheckoutURL: string = 'https://terminal.merit.systems/checkout'
  ) {
    this.baseCheckoutURL = baseCheckoutURL;
  }

  /**
   * Generate a checkout URL for payments to users and repositories
   * @param items - Array of checkout items (users or repos with amounts)
   * @param groupId - Optional group ID to associate payments (auto-generated if not provided)
   * @returns Checkout URL string
   * @example
   * ```typescript
   * // Pay a user
   * const checkoutUrl = sdk.checkout.generateCheckoutUrl([
   *   { id: 583231, type: 'user', amount: 50.00 }
   * ]);
   *
   * // Pay multiple users and repos with custom group ID
   * const checkoutUrl = sdk.checkout.generateCheckoutUrl([
   *   { id: 583231, type: 'user', amount: 25.00 },
   *   { id: 123456, type: 'repo', amount: 75.50 }
   * ], 'my-custom-group-id');
   *
   * // Pay with auto-generated group ID
   * const checkoutUrl = sdk.checkout.generateCheckoutUrl([
   *   { id: 583231, type: 'user', amount: 25.00 }
   * ]); // Group ID will be auto-generated
   *
   * console.log(`Pay here: ${checkoutUrl}`);
   * ```
   */
  generateCheckoutUrl(items: CheckoutItem[], groupId?: string): string {
    const encodedItems = items
      .map(item => {
        const amount = item.amount.toFixed(2);

        if (item.type === 'user') {
          return `u_${item.id}_${amount}`;
        } else if (item.type === 'repo') {
          return `r_${item.id}_${amount}`;
        }
        return '';
      })
      .filter(Boolean);

    const url = new URL(this.baseCheckoutURL);
    url.searchParams.set('items', JSON.stringify(encodedItems));

    // Add group ID (auto-generate if not provided)
    const finalGroupId = groupId || this.generateGroupId();
    url.searchParams.set('groupId', finalGroupId);

    return url.toString();
  }

  /**
   * Generates a new UUID for use as a group ID
   * @returns A RFC 4122 compliant UUID v4 string
   * @example
   * ```typescript
   * const groupId = sdk.checkout.generateGroupId();
   * // Use this UUID for multiple related checkout links
   * const checkoutUrl1 = sdk.checkout.generateCheckoutUrl([
   *   { id: 583231, type: 'user', amount: 50.00 }
   * ], groupId);
   * ```
   */
  generateGroupId(): string {
    return uuidv4();
  }
}
