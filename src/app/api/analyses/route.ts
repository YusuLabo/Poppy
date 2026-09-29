export const runtime = "nodejs";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { validateMedia, imageFileToDataUrl, extractVideoFrames } from "@/lib/media/media";
import { buildAnalysisContext } from "@/lib/analysis/context";
import { analyzeDog } from "@/lib/openai/analyze-dog";
import { KNOWLEDGE_VERSION } from "@/lib/knowledge";

export async function GET() {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const analyses = await prisma.analysis.findMany({ where: { userId: user.id }, include: { dog: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(analyses);
}

export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const form = await request.formData();
    const media = form.get("media");
    if (!(media instanceof File)) return NextResponse.json({ error: "사진 또는 영상을 선택해주세요." }, { status: 400 });
    const mediaType = validateMedia(media);
    const dogId = typeof form.get("dogId") === "string" ? String(form.get("dogId")) || null : null;
    const situationType = typeof form.get("situationType") === "string" ? String(form.get("situationType")).slice(0,60) : undefined;
    const situationText = typeof form.get("situationText") === "string" ? String(form.get("situationText")).slice(0,500) : undefined;

    const dog = dogId ? await prisma.dog.findFirst({ where: { id: dogId, userId: user.id }, include: { traits: true } }) : null;
    if (dogId && !dog) return NextResponse.json({ error: "강아지 정보를 찾을 수 없습니다." }, { status: 404 });

    const negativeFeedback = dog ? await prisma.analysis.findMany({ where: { userId: user.id, dogId: dog.id, feedback: "NOT_MATCH" }, select: { result: true }, orderBy: { createdAt: "desc" }, take: 3 }) : [];
    const { contextText, snapshot } = buildAnalysisContext({ dog, situationType, situationText, negativeFeedback });
    const dataUrls = mediaType === "IMAGE" ? [await imageFileToDataUrl(media)] : await extractVideoFrames(media);
    const { result, model } = await analyzeDog({ contextText, images: dataUrls.map((dataUrl) => ({ dataUrl, detail: "high" as const })) });

    const analysis = await prisma.analysis.create({ data: {
      userId: user.id, dogId: dog?.id ?? null, mediaType,
      situationType: situationType || null, situationText: situationText || null,
      result, contextSnapshot: snapshot, knowledgeVersion: KNOWLEDGE_VERSION, model,
    }});
    return NextResponse.json({ id: analysis.id, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    const map: Record<string, [string, number]> = {
      OPENAI_API_KEY_MISSING: ["OpenAI API 키가 아직 설정되지 않았습니다.", 503],
      FILE_TOO_LARGE: ["파일은 25MB 이하만 업로드할 수 있습니다.", 400],
      UNSUPPORTED_MEDIA_TYPE: ["사진 또는 영상 파일만 업로드할 수 있습니다.", 400],
      VIDEO_TOO_LONG: ["영상은 30초 이하만 분석할 수 있습니다.", 400],
    };
    const [text, status] = map[message] ?? ["분석 중 오류가 발생했습니다.", 500];
    console.error(error);
    return NextResponse.json({ error: text }, { status });
  }
}
