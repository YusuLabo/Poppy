"use client";

import { useEffect, useState } from "react";

type Dog = { id: string; name: string };
type Result = { dogSpeech: string; state: { emotion: string; desire: string }; confidence: "HIGH"|"MEDIUM"|"LOW"; observations: Array<{ evidence: string; source: string }>; interpretation: string; alternatives: Array<{ interpretation: string; reason: string }>; advice: string; aiSuggestedTraits: Array<{ trait: string; reason: string }>; limitations: string[] };

const confidenceLabel = { HIGH: "높음", MEDIUM: "보통", LOW: "낮음" };

export function AnalyzeForm() {
  const [dogs, setDogs] = useState<Dog[]>([]); const [selectedDogId, setSelectedDogId] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [analysisId, setAnalysisId] = useState<string|null>(null); const [result, setResult] = useState<Result|null>(null); const [savedTraits, setSavedTraits] = useState<string[]>([]);
  useEffect(() => { fetch("/api/dogs").then(r => r.ok ? r.json() : []).then(setDogs); }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(""); setResult(null); const form = new FormData(e.currentTarget);
    const r = await fetch("/api/analyses", { method: "POST", body: form }); const body = await r.json().catch(() => ({})); setLoading(false);
    if (!r.ok) { setError(body.error ?? "분석에 실패했습니다."); return; } setResult(body.result); setAnalysisId(body.id);
  }
  async function feedback(value: "MATCH"|"NOT_MATCH") { if (!analysisId) return; await fetch(`/api/analyses/${analysisId}/feedback`, { method: "POST", headers: { "content-type":"application/json" }, body: JSON.stringify({ feedback: value }) }); }
  return <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
    <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
      <div><label className="mb-1 block text-sm font-semibold">분석 대상</label><select name="dogId" value={selectedDogId} onChange={e=>setSelectedDogId(e.target.value)} className="w-full rounded-xl border p-3"><option value="">등록되지 않은 강아지</option>{dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
      <div><label className="mb-1 block text-sm font-semibold">현재 상황</label><select name="situationType" className="w-full rounded-xl border p-3"><option value="">선택 안 함</option><option>놀이 중</option><option>산책 중</option><option>식사 전</option><option>휴식 중</option><option>낯선 사람을 만남</option><option>다른 강아지를 만남</option></select></div>
      <textarea name="situationText" maxLength={500} placeholder="상황을 짧게 설명해주세요 (선택)" className="w-full rounded-xl border p-3" />
      <div><label className="mb-1 block text-sm font-semibold">사진 또는 최대 30초 영상</label><input required name="media" type="file" accept="image/*,video/*" className="w-full rounded-xl border p-3" /></div>
      <button disabled={loading} className="w-full rounded-xl bg-black p-3 text-white disabled:opacity-50">{loading ? "분석 중..." : "분석하기"}</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
    <div>{!result ? <div className="rounded-3xl bg-white p-8 text-neutral-500 shadow-sm">결과가 여기에 표시됩니다.</div> : <article className="space-y-5 rounded-3xl bg-white p-6 shadow-sm"><div className="rounded-2xl bg-neutral-100 p-5"><p className="text-sm text-neutral-500">강아지 대사 표현</p><p className="mt-1 text-2xl font-bold">🐶 “{result.dogSpeech}”</p></div><div className="grid gap-3 sm:grid-cols-3"><Stat label="감정" value={result.state.emotion}/><Stat label="욕구" value={result.state.desire}/><Stat label="확신" value={confidenceLabel[result.confidence]}/></div><section><h3 className="font-bold">해석</h3><p className="mt-1 text-neutral-700">{result.interpretation}</p></section><section><h3 className="font-bold">판단 근거</h3><ul className="mt-2 space-y-2">{result.observations.map((o,i)=><li key={i} className="rounded-xl border p-3"><span className="text-xs text-neutral-500">{o.source}</span><div>{o.evidence}</div></li>)}</ul></section>{result.alternatives.length>0&&<section><h3 className="font-bold">다른 가능한 해석</h3>{result.alternatives.map((a,i)=><p key={i} className="mt-2 text-sm">• {a.interpretation} — {a.reason}</p>)}</section>}<section><h3 className="font-bold">보호자가 해볼 수 있는 것</h3><p className="mt-1">{result.advice}</p></section>{result.aiSuggestedTraits.length>0 && selectedDogId && <section className="rounded-2xl bg-blue-50 p-4"><h3 className="font-bold">이 강아지의 특징으로 저장할까요?</h3>{result.aiSuggestedTraits.map((t,i)=><div key={i} className="mt-3 flex items-start justify-between gap-3"><div><p className="font-medium">{t.trait}</p><p className="text-xs text-neutral-600">{t.reason}</p></div><button disabled={savedTraits.includes(t.trait)} type="button" onClick={async()=>{if(!analysisId)return; const r=await fetch(`/api/dogs/${selectedDogId}/traits`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({text:t.trait,source:"AI_CONFIRMED",sourceAnalysisId:analysisId})}); if(r.ok)setSavedTraits(v=>[...v,t.trait]);}} className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50">{savedTraits.includes(t.trait)?"저장됨":"저장"}</button></div>)}</section>}{result.limitations.length>0&&<p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{result.limitations.join(" · ")}</p>}<div className="flex gap-2"><button type="button" onClick={()=>feedback("MATCH")} className="rounded-xl border px-4 py-2">맞는 것 같아요</button><button type="button" onClick={()=>feedback("NOT_MATCH")} className="rounded-xl border px-4 py-2">아닌 것 같아요</button></div></article>}</div>
  </div>;
}
function Stat({label,value}:{label:string;value:string}) { return <div className="rounded-2xl border p-4"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
