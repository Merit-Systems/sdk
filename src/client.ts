import { BalancesAPI } from './api/balances.js';
import { CheckoutAPI } from './api/checkout.js';
import { PaymentsAPI } from './api/payments.js';
import type { MeritSDKConfig } from './types.js';

export class MeritSDK {
  public readonly balances: BalancesAPI;
  public readonly payments: PaymentsAPI;
  public readonly checkout: CheckoutAPI;

  constructor(config: MeritSDKConfig) {
    const baseURL = config.baseURL ?? 'https://api.merit.systems/v1';
    const checkoutURL =
      config.checkoutURL ?? 'https://terminal.merit.systems/checkout';

    this.balances = new BalancesAPI(config.apiKey, baseURL);
    this.payments = new PaymentsAPI(config.apiKey, baseURL);
    this.checkout = new CheckoutAPI(checkoutURL);
  }
}
