import general from "../../../knowledge/dog-general.json";
import breeds from "../../../knowledge/breeds.json";

export const KNOWLEDGE_VERSION = "2026-09-29-v1";

export function getGeneralDogKnowledge() {
  return general;
}

export function getBreedKnowledge(breedKey?: string | null) {
  if (!breedKey) return null;
  return (breeds as Record<string, unknown>)[breedKey] ?? null;
}
