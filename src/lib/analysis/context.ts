import { getBreedKnowledge, getGeneralDogKnowledge } from "@/lib/knowledge";

export function buildAnalysisContext(input: {
  dog: null | {
    name: string;
    breedKey: string | null;
    sex: string;
    neutered: string;
    personality: string | null;
    traits: Array<{ text: string }>;
  };
  situationType?: string;
  situationText?: string;
  negativeFeedback?: Array<{ result: unknown }>;
}) {
  const general = getGeneralDogKnowledge();
  const breed = input.dog ? getBreedKnowledge(input.dog.breedKey) : null;

  const snapshot = {
    dog: input.dog
      ? {
          name: input.dog.name,
          breedKey: input.dog.breedKey,
          sex: input.dog.sex,
          neutered: input.dog.neutered,
          personality: input.dog.personality,
          traits: input.dog.traits.map((t) => t.text),
        }
      : null,
    situation: {
      type: input.situationType ?? null,
      text: input.situationText ?? null,
    },
    generalKnowledge: general,
    breedKnowledge: breed,
    recentNegativeFeedback: input.negativeFeedback ?? [],
  };

  const contextText = `
[분석 대상]\n${input.dog ? `등록된 강아지: YES\n이름: ${input.dog.name}\n견종 키: ${input.dog.breedKey ?? "미입력"}\n성별: ${input.dog.sex}\n중성화: ${input.dog.neutered}\n성격: ${input.dog.personality ?? "미입력"}` : "등록된 강아지: NO\n견종을 추정하지 말 것"}

[저장된 개별 특징]\n${input.dog?.traits.length ? input.dog.traits.map((t) => `- ${t.text}`).join("\n") : "- 없음"}

[현재 상황]\n분류: ${input.situationType ?? "미입력"}\n사용자 설명: ${input.situationText ?? "미입력"}

[개 일반 행동 참고 정보]\n${JSON.stringify(general, null, 2)}

[견종 참고 정보]\n${breed ? JSON.stringify(breed, null, 2) : "사용하지 않음"}

[최근 부정 피드백]\n${input.negativeFeedback?.length ? JSON.stringify(input.negativeFeedback, null, 2) : "없음"}

첨부된 이미지 또는 영상 프레임을 종합해 분석하라.
`;

  return { contextText, snapshot };
}
