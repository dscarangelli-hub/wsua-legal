export interface JurisdictionItem {
  id: string;
  code: string;
  name: string;
}

export interface SelectorResult {
  mode: 'explicit' | 'agnostic';
  detected_jurisdictions: JurisdictionItem[];
  requires_confirmation: boolean;
  confirmed_jurisdictions: JurisdictionItem[] | null;
  confirmation_prompt?: string;
}

export function isSelectorComplete(result: SelectorResult): boolean {
  if (result.requires_confirmation) return false;
  if (!result.confirmed_jurisdictions || result.confirmed_jurisdictions.length === 0)
    return false;
  return true;
}
