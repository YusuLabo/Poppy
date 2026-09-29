import { z } from "zod";

export const DogAnalysisSchema = z.object({
  dogSpeech: z.string(),
  state: z.object({
    emotion: z.string(),
    desire: z.string(),
  }),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  observations: z.array(
    z.object({
      evidence: z.string(),
      source: z.enum([
        "VISUAL",
        "DOG_PROFILE",
        "SITUATION",
        "GENERAL_DOG",
        "BREED",
        "FEEDBACK",
      ]),
    }),
  ),
  interpretation: z.string(),
  alternatives: z
    .array(z.object({ interpretation: z.string(), reason: z.string() }))
    .max(2),
  advice: z.string(),
  aiSuggestedTraits: z
    .array(z.object({ trait: z.string(), reason: z.string() }))
    .max(3),
  limitations: z.array(z.string()),
});

export type DogAnalysisResult = z.infer<typeof DogAnalysisSchema>;
