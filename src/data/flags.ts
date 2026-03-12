/**
 * Mapeo de Código de Moneda (ISO 4217) a Código de País (ISO 3166-1 alpha-2)
 * para obtener las banderas del CDN de FlagCDN.
 */
export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  ARS: 'ar',
  USD: 'us',
  EUR: 'eu',
  BRL: 'br',
  GBP: 'gb',
  JPY: 'jp',
  CNY: 'cn',
  CLP: 'cl',
  UYU: 'uy',
  PYG: 'py',
  BOB: 'bo',
  COP: 'co',
  PEN: 'pe',
  MXN: 'mx',
  CAD: 'ca',
  AUD: 'au',
  CHF: 'ch',
  INR: 'in',
  ZAR: 'za',
  RUB: 'ru',
  KRW: 'kr',
  TRY: 'tr',
  AED: 'ae',
  SGD: 'sg',
  HKD: 'hk',
  NZD: 'nz',
  NOK: 'no',
  SEK: 'se',
  DKK: 'dk',
  ILS: 'il',
  THB: 'th',
  MYR: 'my',
  PHP: 'ph',
  IDR: 'id',
  VND: 'vn',
  TWD: 'tw',
  SAR: 'sa',
  EGP: 'eg',
  NGN: 'ng',
  KES: 'ke',
};

export function getFlagUrl(currencyCode: string): string | null {
  // Intentar mapeo explícito
  let countryCode = CURRENCY_TO_COUNTRY[currencyCode];
  
  // Si no existe, intentar tomar los primeros 2 caracteres (común en ISO 4217)
  if (!countryCode) {
    countryCode = currencyCode.substring(0, 2).toLowerCase();
  }

  return `https://flagcdn.com/w80/${countryCode}.png`;
}
