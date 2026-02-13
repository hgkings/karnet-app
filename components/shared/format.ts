export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value.toFixed(1)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value);
}
