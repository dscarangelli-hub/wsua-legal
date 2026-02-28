import { extractMetadata } from "../metadata-extraction";
import type { RawDocument } from "../types";

describe("metadata-extraction", () => {
  it("uses raw document fields when provided", () => {
    const raw: RawDocument = {
      content: "Text",
      title: "My Law",
      jurisdictionCode: "UA",
      legalLevel: "national",
      documentType: "statute",
      authority: "Verkhovna Rada",
      sourceUrl: "https://example.com",
    };
    const meta = extractMetadata(raw, null, 0.9);
    expect(meta.jurisdiction).toBe("UA");
    expect(meta.legalLevel).toBe("national");
    expect(meta.documentType).toBe("statute");
    expect(meta.authority).toBe("Verkhovna Rada");
    expect(meta.sourceUrl).toBe("https://example.com");
    expect(meta.translationConfidence).toBe(0.9);
  });

  it("infers legal level from jurisdiction code", () => {
    expect(extractMetadata({ content: "x", jurisdictionCode: "EU" }, null, 0).legalLevel).toBe("regional");
    expect(extractMetadata({ content: "x", jurisdictionCode: "US" }, null, 0).legalLevel).toBe("national");
  });

  it("extracts CELEX from content when not in raw", () => {
    const raw: RawDocument = { content: "Regulation 32016R0679 of the European Parliament." };
    const meta = extractMetadata(raw, null, 0);
    expect(meta.documentIdentifiers.celex).toBeDefined();
  });
});
