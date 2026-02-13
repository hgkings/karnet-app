import { MarketplaceDefaults, Marketplace } from '@/types';

export const marketplaces: MarketplaceDefaults[] = [
  { key: 'trendyol', label: 'Trendyol', commission_pct: 18, return_rate_pct: 8 },
  { key: 'hepsiburada', label: 'Hepsiburada', commission_pct: 15, return_rate_pct: 6 },
  { key: 'n11', label: 'n11', commission_pct: 12, return_rate_pct: 5 },
  { key: 'amazon_tr', label: 'Amazon TR', commission_pct: 17, return_rate_pct: 4 },
  { key: 'custom', label: 'Özel Pazaryeri', commission_pct: 15, return_rate_pct: 5 },
];

export function getMarketplaceDefaults(key: Marketplace): MarketplaceDefaults {
  return marketplaces.find((m) => m.key === key) || marketplaces[4];
}

export function getMarketplaceLabel(key: Marketplace): string {
  return marketplaces.find((m) => m.key === key)?.label || key;
}
