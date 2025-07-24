import Big from 'big.js';

export interface Plant {
  id: string;
  count: Big;
  production: Big;
  cost: Big;
}

export interface Seed {
  id: string;
  count: Big;
}
