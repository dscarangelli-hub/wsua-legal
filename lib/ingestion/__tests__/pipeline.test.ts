import { ingestDocument, normalizeDocument, prepareForGraph } from "../pipeline";
import type { RawDocument, SourceMetadata } from "../types";

describe("pipeline", () => {
  it("normalizeDocument returns content and title", () => {
    const out = normalizeDocument({ content: "  Article 1. Text.  ", title: "My Title" });
    expect(out.content).toBeDefined();
    expect(out.title).toBe("My Title");
  });

  it("prepareForGraph returns valid output shape", () => {
    const out = prepareForGraph({
      document_id: "id-1",
      title: "T",
      jurisdiction: "UA",
      legal_level: "national",
      document_type: "statute",
      authority: "Rada",
      original_language: "uk",
      original_text: "x",
      normalized_text: "x",
      sentence_alignment: [],
      metadata: {} as any,
      version_number: 1,
      source_url: "",
    });
    expect(out.document_id).toBe("id-1");
    expect(out.jurisdiction).toBe("UA");
    expect(out.version_number).toBe(1);
  });

  it("ingestDocument rejects missing content", async () => {
    const result = await ingestDocument({ content: "" } as RawDocument);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("ingestDocument succeeds with valid minimal document", async () => {
    const result = await ingestDocument({
      content: "Article 1. This law shall apply to all persons in the territory of the state.",
      title: "Sample Law",
      jurisdictionCode: "US",
    } as RawDocument);
    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
    expect(result.output!.document_id).toBeDefined();
    expect(result.output!.original_text).toBeDefined();
    expect(result.output!.normalized_text).toBeDefined();
    expect(result.output!.metadata.jurisdiction).toBe("US");
  });

  it("ingestDocument uses source_metadata when provided", async () => {
    const meta: SourceMetadata = { module: "EU", jurisdictionCode: "EU", documentType: "regulation" };
    const result = await ingestDocument(
      { content: "Enough text here to pass validation. Article 1." } as RawDocument,
      meta
    );
    expect(result.success).toBe(true);
    expect(result.output!.metadata.jurisdiction).toBe("EU");
    expect(result.output!.metadata.documentType).toBe("regulation");
  });
});
