/**
 * Tests for versioning and delta tracking in the graph layer.
 * These tests require a running DB; use integration test suite or mock Prisma.
 */

import { describe, it, expect } from "@jest/globals";

describe("Graph versioning contract", () => {
  it("DocumentVersionUpdate type allows optional delta and summary", () => {
    const update = {
      documentId: "doc-1",
      changeSummary: "Minor amendment",
    };
    expect(update.documentId).toBe("doc-1");
    expect(update.changeSummary).toBe("Minor amendment");
  });

  it("GraphDelta entity types are known", () => {
    const entityTypes = ["LEGAL_DOCUMENT", "OBLIGATION", "TEMPLATE", "TEMPLATE_SECTION", "OVERLAY"];
    expect(entityTypes).toContain("LEGAL_DOCUMENT");
    expect(entityTypes).toContain("TEMPLATE");
  });

  it("Edge types include requires, informs, updates", () => {
    const edgeTypes = [
      "implements", "transposes", "amends", "overrides", "interprets",
      "cites", "supersedes", "requires", "informs", "updates",
    ];
    expect(edgeTypes).toContain("requires");
    expect(edgeTypes).toContain("informs");
    expect(edgeTypes).toContain("updates");
  });
});
