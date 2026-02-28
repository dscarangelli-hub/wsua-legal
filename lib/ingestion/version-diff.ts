/**
 * Version diffing — diff between versions, identify changed sections,
 * emit update events for the template update engine.
 */

import type { IngestedDocumentOutput } from "./types";
import { splitSentences } from "./translation";

export interface DocumentVersionDiff {
  oldVersion: number;
  newVersion: number;
  changedSections: Array<{ index: number; oldText: string; newText: string }>;
  summary: string;
}

export interface IngestionUpdateEvent {
  type: "document_version_changed";
  document_id: string;
  oldVersion: number;
  newVersion: number;
  changedSectionIndices: number[];
  metadata: Record<string, unknown>;
}

/**
 * Compute diff between two document versions (sentence-level).
 */
export function diffVersions(
  oldDoc: { normalized_text: string; metadata?: { version_number?: number } },
  newDoc: { normalized_text: string; metadata?: { version_number?: number } }
): DocumentVersionDiff {
  const oldSents = splitSentences(oldDoc.normalized_text ?? "");
  const newSents = splitSentences(newDoc.normalized_text ?? "");
  const oldVer = oldDoc.metadata?.version_number ?? 1;
  const newVer = newDoc.metadata?.version_number ?? 2;

  const changedSections: DocumentVersionDiff["changedSections"] = [];
  const maxLen = Math.max(oldSents.length, newSents.length);
  for (let i = 0; i < maxLen; i++) {
    const oldText = oldSents[i] ?? "";
    const newText = newSents[i] ?? "";
    if (oldText !== newText) changedSections.push({ index: i, oldText, newText });
  }

  return {
    oldVersion: oldVer,
    newVersion: newVer,
    changedSections,
    summary: `${changedSections.length} sentence(s) changed`,
  };
}

/**
 * Emit an update event for the template engine (caller can forward to template update engine).
 */
export function emitUpdateEvent(
  documentId: string,
  diff: DocumentVersionDiff
): IngestionUpdateEvent {
  return {
    type: "document_version_changed",
    document_id: documentId,
    oldVersion: diff.oldVersion,
    newVersion: diff.newVersion,
    changedSectionIndices: diff.changedSections.map((c) => c.index),
    metadata: { changedCount: diff.changedSections.length },
  };
}
