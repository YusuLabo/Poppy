"use client";

import { useEffect, useState } from "react";

type Dog = {
  id: string;
  name: string;
  breedKey: string | null;
  sex: string;
  neutered: string;
  personality: string | null;
  traits: Array<{ id: string; text: string }>;
};

const PRESETS = [
  "겁이 많은 편",
  "활발한 편",
  "낯선 사람을 경계함",
  "다른 강아지를 좋아함",
  "장난감에 관심이 많음",
];

const breedLabel: Record<string, string> = {
  pomeranian: "포메라니안",
  "golden-retriever": "골든 리트리버",
  poodle: "푸들",
};

const sexLabel: Record<string, string> = {
  UNKNOWN: "미입력",
  MALE: "수컷",
  FEMALE: "암컷",
};

const neuteredLabel: Record<string, string> = {
  UNKNOWN: "미입력",
  YES: "완료",
  NO: "안 함",
};

export function DogManager() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/dogs");
    if (response.ok) setDogs(await response.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function addDog(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");

  const formElement = e.currentTarget;
  const form = new FormData(formElement);

  const response = await fetch("/api/dogs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: form.get("name"),
      birthDate: form.get("birthDate") || null,
      breedKey: form.get("breedKey") || null,
      sex: form.get("sex"),
      neutered: form.get("neutered"),
      personality: form.get("personality") || null,
    }),
  });

  if (!response.ok) {
    setError((await response.json()).error ?? "실패");
    return;
  }

  formElement.reset();
  await load();
}

  async function addTrait(dogId: string, text: string, source: "USER" | "PRESET" = "USER") {
    if (!text.trim()) return;

    await fetch("/api/dogs/" + dogId + "/traits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, source }),
    });

    await load();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      <form onSubmit={addDog} className="h-fit rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-800">강아지 등록</h2>
          <p className="mt-1 text-xs text-slate-500">기본 프로필을 추가합니다.</p>
        </div>

        <div className="space-y-4 p-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">이름</span>
            <input
              required
              name="name"
              placeholder="이름"
              className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">생년월일</span>
            <input
              name="birthDate"
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">견종</span>
            <select
              name="breedKey"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
            >
              <option value="">선택 안 함</option>
              <option value="pomeranian">포메라니안</option>
              <option value="golden-retriever">골든 리트리버</option>
              <option value="poodle">푸들</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">성별</span>
              <select
                name="sex"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="UNKNOWN">미입력</option>
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">중성화</span>
              <select
                name="neutered"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="UNKNOWN">미입력</option>
                <option value="YES">완료</option>
                <option value="NO">안 함</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">평소 성격</span>
            <textarea
              name="personality"
              maxLength={500}
              rows={4}
              placeholder="평소 성격이나 행동 특징"
              className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button className="w-full rounded-lg bg-[#6377e8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5568d7]">
            등록
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">강아지 관리</h2>
            <p className="mt-1 text-xs text-slate-500">등록된 프로필과 특징을 관리합니다.</p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {dogs.length}마리
          </span>
        </div>

        {dogs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">등록된 강아지가 없습니다.</p>
            <p className="mt-1 text-sm text-slate-400">왼쪽에서 첫 프로필을 등록하세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {dogs.map((dog) => (
              <article key={dog.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{dog.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 font-semibold text-blue-700">
                        {dog.breedKey ? breedLabel[dog.breedKey] ?? dog.breedKey : "견종 미입력"}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-700">
                        {sexLabel[dog.sex] ?? dog.sex}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                        중성화 {neuteredLabel[dog.neutered] ?? dog.neutered}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400">특징 {dog.traits.length}개</span>
                </div>

                {dog.personality && (
                  <p className="mt-4 rounded-lg bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-600">
                    {dog.personality}
                  </p>
                )}

                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500">저장된 특징</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dog.traits.length === 0 && (
                      <span className="text-xs text-slate-400">저장된 특징 없음</span>
                    )}
                    {dog.traits.map((trait) => (
                      <span
                        key={trait.id}
                        className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700"
                      >
                        {trait.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500">빠른 특징 추가</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PRESETS.filter((preset) => !dog.traits.some((trait) => trait.text === preset)).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addTrait(dog.id, preset, "PRESET")}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>

                  <form
                    className="mt-3 flex gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const data = new FormData(form);
                      await addTrait(dog.id, String(data.get("trait") ?? ""));
                      form.reset();
                    }}
                  >
                    <input
                      name="trait"
                      maxLength={200}
                      placeholder="직접 특징 입력"
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                    />
                    <button className="rounded-lg bg-emerald-500 px-4 text-xs font-semibold text-white">
                      추가
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
