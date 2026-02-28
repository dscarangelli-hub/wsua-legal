export type LegalModule = 'INTERNATIONAL' | 'EU' | 'UKRAINE' | 'US';

export const MODULE_UPDATE_RHYTHMS: Record<LegalModule, string> = {
  INTERNATIONAL: 'weekly/monthly',
  EU: 'daily/weekly',
  UKRAINE: 'daily',
  US: 'daily',
};
