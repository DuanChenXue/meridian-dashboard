const currency0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const number0 = new Intl.NumberFormat("en-US");
const oneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currency0.format(value);
}

export function formatCurrencyCompact(value: number): string {
  return currencyCompact.format(value);
}

export function formatNumber(value: number): string {
  return number0.format(value);
}

export function formatPercent(value: number): string {
  return `${oneDecimal.format(value)}%`;
}

/** e.g. +4.2% or -1.3% */
export function formatDelta(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${oneDecimal.format(Math.abs(value))}%`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
