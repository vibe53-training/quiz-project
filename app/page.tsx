"use client";

import { useState } from "react";
import QuizForm from "@/components/QuizForm";
import QuestionCard from "@/components/QuestionCard";
import type { GenerateRequest, Quiz } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [lastRequest, setLastRequest] = useState<GenerateRequest | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const [graded, setGraded] = useState(false);

  async function generate(req: GenerateRequest) {
    setLoading(true);
    setError(null);
    setLastRequest(req);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "문제 생성에 실패했습니다.");
      setQuiz(data as Quiz);
      setAnswers({});
      setShown({});
      setGraded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const isMC = quiz?.type === "multiple_choice";
  const score = quiz && isMC ? quiz.questions.filter((q) => answers[q.id] === q.answer).length : 0;
  const allShown = quiz ? quiz.questions.every((q) => shown[q.id]) : false;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">AI 퀴즈 생성기</h1>
        <p className="mt-2 text-slate-600">과목과 단원명을 입력하면 AI가 문제를 출제합니다.</p>
      </header>

      <QuizForm loading={loading} onSubmit={generate} />

      {loading && (
        <div className="mt-8 flex items-center justify-center gap-3 text-slate-600" role="status">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          AI가 문제를 만들고 있어요...
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          <p>{error}</p>
          {lastRequest && (
            <button className="mt-2 font-semibold underline" onClick={() => generate(lastRequest)}>
              다시 시도
            </button>
          )}
        </div>
      )}

      {quiz && !loading && (
        <section className="mt-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">
              {quiz.subject} · {quiz.unit}{" "}
              <span className="text-base font-normal text-slate-500">({isMC ? "객관식" : "주관식"})</span>
            </h2>
            <button
              className="text-sm font-medium text-indigo-600 hover:underline"
              onClick={() =>
                setShown(allShown ? {} : Object.fromEntries(quiz.questions.map((q) => [q.id, true])))
              }
            >
              {allShown ? "전체 해설 숨기기" : "전체 정답·해설 보기"}
            </button>
          </div>

          {graded && isMC && (
            <div className="rounded-xl bg-indigo-50 p-4 text-center font-semibold text-indigo-800">
              점수: {score} / {quiz.questions.length}
            </div>
          )}

          {quiz.questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              userAnswer={answers[q.id]}
              graded={graded}
              showAnswer={!!shown[q.id]}
              onAnswer={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
              onToggleAnswer={() => setShown((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
            />
          ))}

          <div className="flex gap-3 pt-2">
            {!graded ? (
              <button
                className="flex-1 rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                onClick={() => setGraded(true)}
              >
                {isMC ? "채점하기" : "모범답안과 비교하기"}
              </button>
            ) : (
              <button
                className="flex-1 rounded-lg border border-slate-300 bg-white py-3 font-semibold hover:bg-slate-50"
                onClick={() => {
                  setAnswers({});
                  setShown({});
                  setGraded(false);
                }}
              >
                다시 풀기
              </button>
            )}
            {lastRequest && (
              <button
                className="flex-1 rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
                onClick={() => generate(lastRequest)}
              >
                다시 생성
              </button>
            )}
          </div>

          <p className="pt-4 text-center text-xs text-slate-400">
            AI가 생성한 문제는 부정확할 수 있으니 사용 전 검토해주세요.
          </p>
        </section>
      )}
    </main>
  );
}
