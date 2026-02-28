/**
 * Tests for jurisdiction classifier: multi-jurisdiction detection,
 * single-jurisdiction detection, and ranking.
 */

import {
  classifyJurisdictions,
  getDetectedCodes,
  type JurisdictionCode,
} from "../jurisdiction-classifier";

describe("jurisdiction-classifier", () => {
  describe("classifyJurisdictions", () => {
    it("returns empty array for empty query", () => {
      expect(classifyJurisdictions("")).toEqual([]);
      expect(classifyJurisdictions("   ")).toEqual([]);
    });

    it("detects U.S. federal from CFR citation", () => {
      const ranked = classifyJurisdictions("See 31 CFR § 501.123 for sanctions.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("US");
      expect(ranked[0].score).toBeGreaterThan(0);
    });

    it("detects EU from CELEX and directive", () => {
      const ranked = classifyJurisdictions("Directive (EU) 2016/679 and CELEX 32016R0679.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("EU");
    });

    it("detects Ukrainian law from Cyrillic and institutional name", () => {
      const ranked = classifyJurisdictions("Верховний Суд України та Кодекс України.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("UA");
    });

    it("detects multiple jurisdictions and returns ranked list", () => {
      const query =
        "CFR 31 and EU Regulation 2022/2065; Ukrainian NGO registration and 9th Circuit precedent.";
      const ranked = classifyJurisdictions(query);
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("US");
      expect(codes).toContain("EU");
      expect(codes).toContain("UA");
      expect(codes).toContain("US_CIRCUIT");
      expect(ranked.length).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < ranked.length; i++) {
        expect(ranked[i].score).toBeLessThanOrEqual(ranked[i - 1].score);
      }
    });

    it("detects U.S. circuit from institutional name", () => {
      const ranked = classifyJurisdictions("Ninth Circuit held that the statute was preempted.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("US_CIRCUIT");
    });

    it("detects U.S. state from state statute keyword", () => {
      const ranked = classifyJurisdictions("California Supreme Court and state statute.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("US_STATE");
    });

    it("detects international from UN and treaty", () => {
      const ranked = classifyJurisdictions("UN Security Council resolution and Geneva Convention.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("INTERNATIONAL");
    });

    it("detects UA_OBLAST from oblast keyword", () => {
      const ranked = classifyJurisdictions("рішення обласної ради та обласна рада.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("UA_OBLAST");
    });

    it("detects UA_CITY from city keyword", () => {
      const ranked = classifyJurisdictions("міська рада Києва та КМДА.");
      const codes = ranked.map((r) => r.code);
      expect(codes).toContain("UA_CITY");
    });

    it("includes signals for each detection", () => {
      const ranked = classifyJurisdictions("31 U.S.C. § 101");
      expect(ranked.length).toBeGreaterThan(0);
      expect(ranked[0].signals).toBeDefined();
      expect(ranked[0].signals!.length).toBeGreaterThan(0);
      expect(ranked[0].signals![0]).toMatchObject({
        kind: expect.stringMatching(/citation|institution|language|document_type|keyword/),
        value: expect.any(String),
        score: expect.any(Number),
      });
    });
  });

  describe("getDetectedCodes", () => {
    it("returns distinct codes above minScore", () => {
      const codes = getDetectedCodes(
        "EU Regulation and Ukrainian law and 9th Circuit."
      );
      expect(codes).toContain("EU");
      expect(codes).toContain("UA");
      expect(codes).toContain("US_CIRCUIT");
      expect(new Set(codes).size).toBe(codes.length);
    });

    it("respects minScore threshold", () => {
      const low = getDetectedCodes("something random", 2.0);
      const high = getDetectedCodes("31 CFR and CELEX 32016R0679", 0.2);
      expect(high.length).toBeGreaterThanOrEqual(low.length);
    });
  });
});
