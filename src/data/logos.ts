/**
 * Mapeo de Código de Entidad BCRA a archivos locales SVG.
 * Basado en los códigos devueltos por la API de Transparencia del BCRA.
 */
export const LOGO_MAP: Record<number, string> = {
  // Códigos extraídos de la API de Transparencia
  7: 'galicia.svg',
  11: 'banco-nacion.svg',
  14: 'banco-provincia.svg',
  15: 'icbc.svg',
  17: 'bbva.svg',
  20: 'bancor.svg',
  27: 'banco-supervielle.svg',
  29: 'banco-ciudad.svg',
  34: 'banco-patagonia.svg',
  44: 'banco-hipotecario.svg',
  45: 'banco-san-juan.svg',
  65: 'banco-municipal.svg',
  72: 'banco-santander.svg',
  86: 'banco-santa-cruz.svg',
  94: 'banco-corrientes.svg',
  143: 'brubank.svg',
  191: 'banco-credicoop.svg',
  285: 'banco-macro.svg',
  299: 'banco-comafi.svg',
  301: 'banco-piano.svg',
  310: 'banco-del-sol.svg',
  330: 'banco-santa-fe.svg',
  384: 'ual.svg',
  386: 'banco-entre-rios.svg',
  389: 'banco-columbia.svg',
  426: 'banco-bica.svg',
  431: 'banco-coinag.svg',
  
  // Otros códigos y billeteras (PSP)
  44059: 'mercadopago.svg',
  44093: 'ual.svg',
  44095: 'naranja-x.svg',
  44099: 'brubank.svg',
  44096: 'openbank.svg',
  44092: 'personal-pay.svg',
  44088: 'lemon.svg',
  44101: 'belo.svg',
  44102: 'prex.svg',
  340: 'yoy.svg',
};

// Mapeo por nombre (normalizado) para Central de Deudores
export const LOGO_NAME_MAP: Record<string, string> = {
  'galicia': 'galicia.svg',
  'nacion': 'banco-nacion.svg',
  'provincia de buenos aires': 'banco-provincia.svg',
  'provincia': 'banco-provincia.svg',
  'icbc': 'icbc.svg',
  'bbva': 'bbva.svg',
  'frances': 'bbva.svg',
  'bancor': 'bancor.svg',
  'cordoba': 'bancor.svg',
  'supervielle': 'banco-supervielle.svg',
  'ciudad': 'banco-ciudad.svg',
  'patagonia': 'banco-patagonia.svg',
  'hipotecario': 'banco-hipotecario.svg',
  'san juan': 'banco-san-juan.svg',
  'municipal': 'banco-municipal.svg',
  'santander': 'banco-santander.svg',
  'santa cruz': 'banco-santa-cruz.svg',
  'corrientes': 'banco-corrientes.svg',
  'brubank': 'brubank.svg',
  'credicoop': 'banco-credicoop.svg',
  'macro': 'banco-macro.svg',
  'comafi': 'banco-comafi.svg',
  'piano': 'banco-piano.svg',
  'del sol': 'banco-del-sol.svg',
  'santa fe': 'banco-santa-fe.svg',
  'uala': 'ual.svg',
  'alau': 'ual.svg',
  'entre rios': 'banco-entre-rios.svg',
  'columbia': 'banco-columbia.svg',
  'bica': 'banco-bica.svg',
  'coinag': 'banco-coinag.svg',
  'mercadopago': 'mercadopago.svg',
  'mercadolibre': 'mercadopago.svg',
  'naranja': 'naranja-x.svg',
  'openbank': 'openbank.svg',
  'personal pay': 'personal-pay.svg',
  'lemon': 'lemon.svg',
  'belo': 'belo.svg',
  'prex': 'prex.svg',
  'yoy': 'yoy.svg',
  'hsbc': 'hsbc.svg',
  'ita': 'ita.svg',
};

// Mapeos secundarios o redundantes
const ALIAS_MAP: Record<number, number> = {
  322: 15,  // Variante ICBC
  150: 15,  // Variante ICBC
  259: 259, // Itaú
  46: 259,  // Itaú variante
  309: 299, // Comafi variante
};

export function getBankLogo(codigo: number): string | null {
  const actualCodigo = ALIAS_MAP[codigo] || codigo;
  const filename = LOGO_MAP[actualCodigo];
  if (!filename) return null;
  return `/logos/${filename}`;
}

export function getBankLogoByName(name: string): string | null {
  if (!name) return null;
  const normalized = name.toLowerCase();
  
  // Buscar coincidencia parcial en el mapa de nombres
  for (const [key, filename] of Object.entries(LOGO_NAME_MAP)) {
    if (normalized.includes(key)) {
      return `/logos/${filename}`;
    }
  }
  
  return null;
}
