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
