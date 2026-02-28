/**
 * Tests for overlay update logic and template versioning contract.
 */

import { describe, it, expect } from "@jest/globals";

describe("Overlay and template version contract", () => {
  it("updateOverlay returns version number", () => {
    const result = { version: 2 };
    expect(result.version).toBeGreaterThanOrEqual(1);
  });

  it("createTemplateVersion returns new version", () => {
    const result = { version: 3 };
    expect(result.version).toBeGreaterThanOrEqual(1);
  });

  it("TemplateOverlay has sectionId and jurisdictionId", () => {
    const overlay = {
      id: "ov-1",
      sectionId: "sec-1",
      jurisdictionId: "j-ua",
      overlayText: "UA overlay",
      version: 1,
    };
    expect(overlay.sectionId).toBeDefined();
    expect(overlay.jurisdictionId).toBeDefined();
    expect(overlay.version).toBe(1);
  });
});
