import type { SupportedLanguage } from './types';

export function detectLanguage(text: string): { language: SupportedLanguage; confidence: number } {
  if (!text || text.length < 10) {
    return { language: 'en', confidence: 0 };
  }
  const t = text.slice(0, 2000);
  if (/[а-яіїєґ]/i.test(t)) {
    const uk = /[іїєґ]/i.test(t);
    return { language: uk ? 'uk' : 'ru', confidence: uk ? 0.9 : 0.85 };
  }
  if (/\b(the|and|of|to|in|is|for|on|with|that|by)\b/i.test(t)) {
    return { language: 'en', confidence: 0.9 };
  }
  if (/\b(und|der|die|das|ist|für|mit)\b/i.test(t)) return { language: 'de', confidence: 0.85 };
  if (/\b(et|les|des|est|pour|dans)\b/i.test(t)) return { language: 'fr', confidence: 0.85 };
  if (/\b(el|la|los|las|es|por|con)\b/i.test(t)) return { language: 'es', confidence: 0.85 };
  return { language: 'en', confidence: 0.5 };
}

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  const supported: string[] = [
    'uk', 'ru', 'en', 'fr', 'de', 'nl', 'pl', 'es',
    'ar', 'zh', 'it', 'pt', 'ja', 'el', 'bg', 'hr', 'cs', 'da', 'et', 'fi', 'hu', 'ga', 'lv', 'lt', 'mt', 'ro', 'sk', 'sl', 'sv',
  ];
  return supported.includes(code);
}
