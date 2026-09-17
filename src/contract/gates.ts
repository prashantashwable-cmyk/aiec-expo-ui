import type { TranslationKey } from "@/i18n";

/**
 * The five payment gates, as data.
 *
 * These are enforced server-side at the API — a gate that exists only in the
 * UI is not a gate. This table is the *presentation* of a refusal the server
 * already made, so that a blocked screen can always say which gate stopped it,
 * what unblocks it, and who can act. It is never the enforcement itself.
 */
export const PAYMENT_GATES = {
  token: {
    id: "token",
    order: 1,
    titleKey: "gates.tokenTitle",
    blocksKey: "gates.tokenBlocks",
    unblockKey: "gates.tokenUnblock",
    whoActsKey: "gates.tokenWhoActs",
  },
  qcClearance: {
    id: "qcClearance",
    order: 2,
    titleKey: "gates.qcTitle",
    blocksKey: "gates.qcBlocks",
    unblockKey: "gates.qcUnblock",
    whoActsKey: "gates.qcWhoActs",
  },
  preDispatchPayment: {
    id: "preDispatchPayment",
    order: 3,
    titleKey: "gates.dispatchTitle",
    blocksKey: "gates.dispatchBlocks",
    unblockKey: "gates.dispatchUnblock",
    whoActsKey: "gates.dispatchWhoActs",
  },
  verifiedEvidence: {
    id: "verifiedEvidence",
    order: 4,
    titleKey: "gates.evidenceTitle",
    blocksKey: "gates.evidenceBlocks",
    unblockKey: "gates.evidenceUnblock",
    whoActsKey: "gates.evidenceWhoActs",
  },
  finalPayment: {
    id: "finalPayment",
    order: 5,
    titleKey: "gates.nocTitle",
    blocksKey: "gates.nocBlocks",
    unblockKey: "gates.nocUnblock",
    whoActsKey: "gates.nocWhoActs",
  },
} as const satisfies Record<string, GateDefinition>;

export interface GateDefinition {
  id: string;
  order: number;
  titleKey: TranslationKey;
  blocksKey: TranslationKey;
  unblockKey: TranslationKey;
  whoActsKey: TranslationKey;
}

export type GateId = keyof typeof PAYMENT_GATES;

export const GATE_IDS = Object.keys(PAYMENT_GATES) as GateId[];
