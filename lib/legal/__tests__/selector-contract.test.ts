/**
 * Tests for jurisdiction selector output contract and isSelectorComplete.
 */

import {
  isSelectorComplete,
  type JurisdictionSelectorResult,
  type JurisdictionItem,
} from "../selector-contract";

const mockJurisdiction = (overrides?: Partial<JurisdictionItem>): JurisdictionItem => ({
  id: "test-id",
  code: "UA",
  name: "Ukraine",
  layer: "national",
  ...overrides,
});

describe("selector-contract", () => {
  describe("isSelectorComplete", () => {
    it("returns false when requires_confirmation is true", () => {
      const result: JurisdictionSelectorResult = {
        mode: "agnostic",
        detected_jurisdictions: [mockJurisdiction()],
        requires_confirmation: true,
        confirmed_jurisdictions: null,
      };
      expect(isSelectorComplete(result)).toBe(false);
    });

    it("returns false when confirmed_jurisdictions is null", () => {
      const result: JurisdictionSelectorResult = {
        mode: "agnostic",
        detected_jurisdictions: [],
        requires_confirmation: false,
        confirmed_jurisdictions: null,
      };
      expect(isSelectorComplete(result)).toBe(false);
    });

    it("returns false when confirmed_jurisdictions is empty array", () => {
      const result: JurisdictionSelectorResult = {
        mode: "explicit",
        detected_jurisdictions: [],
        requires_confirmation: false,
        confirmed_jurisdictions: [],
      };
      expect(isSelectorComplete(result)).toBe(false);
    });

    it("returns true when requires_confirmation false and confirmed_jurisdictions has items", () => {
      const result: JurisdictionSelectorResult = {
        mode: "explicit",
        detected_jurisdictions: [],
        requires_confirmation: false,
        confirmed_jurisdictions: [mockJurisdiction()],
      };
      expect(isSelectorComplete(result)).toBe(true);
    });

    it("returns true for agnostic mode after confirmation", () => {
      const result: JurisdictionSelectorResult = {
        mode: "agnostic",
        detected_jurisdictions: [],
        requires_confirmation: false,
        confirmed_jurisdictions: [
          mockJurisdiction({ code: "EU" }),
          mockJurisdiction({ code: "UA" }),
        ],
      };
      expect(isSelectorComplete(result)).toBe(true);
    });
  });
});
