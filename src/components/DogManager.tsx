"use client";

import { useEffect, useState } from "react";

type Dog = { id: string; name: string; breedKey: string | null; sex: string; neutered: string; personality: string | null; traits: Array<{ id: string; text: string }> };
const PRESETS = ["겁이 많은 편", "활발한 편", "낯선 사람을 경계함", "다른 강아지를 좋아함", "장난감에 관심이 많음"];

export function DogManager() {
  const [dogs, setDogs] = useState<Dog[]>([]); const [error, setError] = useState("");
  async function load() { const r = await fetch("/api/dogs"); if (r.ok) setDogs(await r.json()); }
  useEffect(() => { void load(); }, []);

  async function addDog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); const f = new FormData(e.currentTarget);
    const r = await fetch("/api/dogs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      name: f.get("name"), birthDate: f.get("birthDate") || null, breedKey: f.get("breedKey") || null,
      sex: f.get("sex"), neutered: f.get("neutered"), personality: f.get("personality") || null,
    }) });
    if (!r.ok) { setError((await r.json()).error ?? "실패"); return; } e.currentTarget.reset(); await load();
  }

  async function addTrait(dogId: string, text: string, source: "USER"|"PRESET" = "USER") {
    if (!text.trim()) return;
    await fetch(`/api/dogs/${dogId}/traits`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, source }) }); await load();
  }

  return <div className="grid gap-6 md:grid-cols-[340px_1fr]">
    <form onSubmit={addDog} className="space-y-3 rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">강아지 등록</h2>
      <input required name="name" placeholder="이름" className="w-full rounded-xl border p-3" />
      <div><label className="mb-1 block text-xs text-neutral-500">생년월일 또는 대략적인 생일 (선택)</label><input name="birthDate" type="date" className="w-full rounded-xl border p-3" /></div>
      <select name="breedKey" className="w-full rounded-xl border p-3"><option value="">견종 선택 안 함</option><option value="pomeranian">포메라니안</option><option value="golden-retriever">골든 리트리버</option><option value="poodle">푸들</option></select>
      <div className="grid grid-cols-2 gap-2"><select name="sex" className="rounded-xl border p-3"><option value="UNKNOWN">성별 미입력</option><option value="MALE">수컷</option><option value="FEMALE">암컷</option></select><select name="neutered" className="rounded-xl border p-3"><option value="UNKNOWN">중성화 미입력</option><option value="YES">중성화 O</option><option value="NO">중성화 X</option></select></div>
      <textarea name="personality" maxLength={500} placeholder="평소 성격 (선택)" className="w-full rounded-xl border p-3" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="w-full rounded-xl bg-black p-3 text-white">등록</button>
    </form>
    <div className="space-y-4">
      {dogs.length === 0 && <div className="rounded-3xl bg-white p-6">아직 등록된 강아지가 없습니다.</div>}
      {dogs.map((dog) => <article key={dog.id} className="rounded-3xl bg-white p-5 shadow-sm">
        <div><h3 className="text-xl font-bold">{dog.name}</h3><p className="text-sm text-neutral-500">{dog.breedKey ?? "견종 미입력"} · {dog.sex} · 중성화 {dog.neutered}</p></div>
        {dog.personality && <p className="mt-3">{dog.personality}</p>}
        <div className="mt-4 flex flex-wrap gap-2">{dog.traits.map(t => <span key={t.id} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">{t.text}</span>)}</div>
        <p className="mt-4 text-xs font-semibold text-neutral-500">빠른 특징 추가</p><div className="mt-2 flex flex-wrap gap-2">{PRESETS.filter(x => !dog.traits.some(t=>t.text===x)).map(x => <button key={x} type="button" onClick={()=>addTrait(dog.id,x,"PRESET")} className="rounded-full border px-3 py-1 text-sm">+ {x}</button>)}</div>
        <form className="mt-4 flex gap-2" onSubmit={async e => { e.preventDefault(); const form=e.currentTarget; const f=new FormData(form); await addTrait(dog.id,String(f.get("trait")??"")); form.reset(); }}><input name="trait" maxLength={200} placeholder="직접 특징 입력" className="min-w-0 flex-1 rounded-xl border p-2"/><button className="rounded-xl border px-3">추가</button></form>
      </article>)}
    </div>
  </div>;
}
