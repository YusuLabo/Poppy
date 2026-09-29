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
  UNKNOWN: "성별 미입력",
  MALE: "수컷",
  FEMALE: "암컷",
};

const neuteredLabel: Record<string, string> = {
  UNKNOWN: "중성화 미입력",
  YES: "중성화 O",
  NO: "중성화 X",
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

    const form = new FormData(e.currentTarget);
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

    e.currentTarget.reset();
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
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form
        onSubmit={addDog}
        className="h-fit space-y-4 rounded-[32px] border border-white/90 bg-white/80 p-5 shadow-[0_18px_55px_rgba(86,63,52,0.09)] backdrop-blur-xl lg:sticky lg:top-28"
      >
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-xl">
            🐕
          </div>
          <div>
            <h2 className="font-black text-stone-800">강아지 등록</h2>
            <p className="mt-1 text-xs font-medium leading-5 text-stone-400">
              기본 정보와 평소 성격을 알려주세요.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-black text-stone-700">이름</span>
          <input
            required
            name="name"
            placeholder="예: 뽀삐"
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black text-stone-700">
            생년월일 <span className="font-bold text-stone-300">선택</span>
          </span>
          <input
            name="birthDate"
            type="date"
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black text-stone-700">견종</span>
          <select
            name="breedKey"
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm"
          >
            <option value="">견종 선택 안 함</option>
            <option value="pomeranian">포메라니안</option>
            <option value="golden-retriever">골든 리트리버</option>
            <option value="poodle">푸들</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="mb-2 block text-xs font-black text-stone-700">성별</span>
            <select
              name="sex"
              className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-3.5 text-sm font-semibold shadow-sm"
            >
              <option value="UNKNOWN">미입력</option>
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs font-black text-stone-700">중성화</span>
            <select
              name="neutered"
              className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-3.5 text-sm font-semibold shadow-sm"
            >
              <option value="UNKNOWN">미입력</option>
              <option value="YES">O</option>
              <option value="NO">X</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-black text-stone-700">
            평소 성격 <span className="font-bold text-stone-300">선택</span>
          </span>
          <textarea
            name="personality"
            maxLength={500}
            rows={3}
            placeholder="예: 집에서는 차분하지만 산책만 나가면 아주 신나요."
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 shadow-sm"
          />
        </label>

        {error && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </p>
        )}

        <button className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(118,91,205,0.24)] transition hover:-translate-y-0.5">
          ＋ 등록하기
        </button>
      </form>

      <div className="space-y-4">
        {dogs.length === 0 && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-white/90 bg-white/70 p-8 text-center shadow-[0_18px_55px_rgba(86,63,52,0.08)] backdrop-blur-xl">
            <div className="grid size-20 place-items-center rounded-[28px] bg-gradient-to-br from-violet-100 to-orange-100 text-4xl">
              🐾
            </div>
            <h3 className="mt-5 text-xl font-black text-stone-800">아직 등록된 강아지가 없어요</h3>
            <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-stone-400">
              왼쪽 폼에서 첫 강아지를 등록해보세요. 평소 특징은 나중에 조금씩 추가해도 괜찮아요.
            </p>
          </div>
        )}

        {dogs.map((dog, index) => (
          <article
            key={dog.id}
            className="overflow-hidden rounded-[32px] border border-white/90 bg-white/80 shadow-[0_18px_55px_rgba(86,63,52,0.08)] backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-violet-50 via-white to-orange-50 p-5 md:p-6">
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-[22px] bg-white text-3xl shadow-sm">
                  {index % 3 === 0 ? "🐶" : index % 3 === 1 ? "🐕" : "🐾"}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-stone-900">{dog.name}</h3>
                  <p className="mt-1 text-xs font-bold text-stone-400">
                    {dog.breedKey ? breedLabel[dog.breedKey] ?? dog.breedKey : "견종 미입력"}
                    {" · "}
                    {sexLabel[dog.sex] ?? dog.sex}
                    {" · "}
                    {neuteredLabel[dog.neutered] ?? dog.neutered}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-violet-500 shadow-sm">
                profile
              </span>
            </div>

            <div className="p-5 md:p-6">
              {dog.personality && (
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">평소 성격</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{dog.personality}</p>
                </div>
              )}

              <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-stone-700">저장된 특징</p>
                  <span className="text-[10px] font-bold text-stone-300">{dog.traits.length}개</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {dog.traits.length === 0 && (
                    <span className="text-xs font-medium text-stone-400">아직 저장된 특징이 없어요.</span>
                  )}
                  {dog.traits.map((trait) => (
                    <span
                      key={trait.id}
                      className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700"
                    >
                      {trait.text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-stone-100 pt-5">
                <p className="text-xs font-black text-stone-700">빠른 특징 추가</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.filter((preset) => !dog.traits.some((trait) => trait.text === preset)).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addTrait(dog.id, preset, "PRESET")}
                      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
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
                    className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm"
                  />
                  <button className="rounded-2xl bg-stone-900 px-4 text-xs font-black text-white transition hover:bg-violet-700">
                    추가
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
