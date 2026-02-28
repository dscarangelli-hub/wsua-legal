import { normalizeDocumentText } from "../normalization";

describe("normalization", () => {
  it("returns empty for empty input", () => {
    expect(normalizeDocumentText("")).toBe("");
  });
  it("replaces CRLF with LF", () => {
    expect(normalizeDocumentText("a\r\nb")).toBe("a\nb");
  });
  it("collapses multiple blank lines", () => {
    expect(normalizeDocumentText("a\n\n\n\nb")).toBe("a\n\nb");
  });
});
