import { detectLanguage, isSupportedLanguage } from "../language-detection";

describe("language-detection", () => {
  it("returns unknown for empty or very short text", () => {
    expect(detectLanguage("").language).toBe("unknown");
    expect(detectLanguage("ab").language).toBe("unknown");
  });
  it("detects Ukrainian from Cyrillic and Ukrainian-specific chars", () => {
    const r = detectLanguage("Стаття 1. Закон України. Цей закон визначає порядок.");
    expect(r.language).toBe("uk");
  });
  it("detects English from Latin and common words", () => {
    const r = detectLanguage("Article 1. The law shall apply to all persons.");
    expect(r.language).toBe("en");
  });
  it("isSupportedLanguage returns true for known codes", () => {
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("zz")).toBe(false);
  });
});
