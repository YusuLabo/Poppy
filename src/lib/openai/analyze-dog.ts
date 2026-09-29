import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { DOG_ANALYSIS_SYSTEM_PROMPT } from "@/lib/openai/prompt";
import { DogAnalysisSchema } from "@/lib/openai/schema";

export async function analyzeDog(input: {
  contextText: string;
  images: Array<{ dataUrl: string; detail?: "auto" | "low" | "high" | "original" }>;
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }

  const model = process.env.DOG_ANALYSIS_MODEL ?? "gpt-5.6-luna";
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.responses.parse({
    model,
    store: false,
    reasoning: { effort: "low" },
    input: [
      { role: "developer", content: DOG_ANALYSIS_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "input_text", text: input.contextText },
          ...input.images.map((image) => ({
            type: "input_image" as const,
            image_url: image.dataUrl,
            detail: image.detail ?? "high",
          })),
        ],
      },
    ],
    text: {
      format: zodTextFormat(DogAnalysisSchema, "dog_analysis"),
    },
  });

  if (!response.output_parsed) throw new Error("OPENAI_OUTPUT_PARSE_FAILED");
  return { result: response.output_parsed, model };
}
