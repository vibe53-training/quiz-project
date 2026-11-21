"use client";

import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  userAnswer: number | string | undefined;
  graded: boolean;
  showAnswer: boolean;
  onAnswer: (value: number | string) => void;
  onToggleAnswer: () => void;
}

const LABELS = ["①", "②", "③", "④"];

export default function QuestionCard({ question, userAnswer, graded, showAnswer, onAnswer, onToggleAnswer }: Props) {
  const isMC = Array.isArray(question.options);
  const correct = isMC && graded ? userAnswer === question.answer : undefined;
  const revealed = showAnswer || graded;

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-relaxed">
          <span className="mr-2 text-indigo-600">Q{question.id}.</span>
          {question.question}
        </h3>
        {correct !== undefined && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {correct ? "정답" : "오답"}
          </span>
        )}
      </div>

      {isMC ? (
        <ul className="space-y-2">
          {question.options!.map((opt, i) => {
            const selected = userAnswer === i;
            const isAnswer = revealed && i === question.answer;
            const isWrongPick = graded && selected && i !== question.answer;
            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={graded}
                  onClick={() => onAnswer(i)}
                  className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition ${
                    isAnswer
                      ? "border-emerald-500 bg-emerald-50"
                      : isWrongPick
                        ? "border-rose-400 bg-rose-50"
                        : selected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="mr-2">{LABELS[i]}</span>
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-50"
          rows={3}
          placeholder="답안을 입력하세요"
          disabled={graded}
          value={typeof userAnswer === "string" ? userAnswer : ""}
          onChange={(e) => onAnswer(e.target.value)}
        />
      )}

      <div className="mt-4">
        {!graded && (
          <button type="button" onClick={onToggleAnswer} className="text-sm font-medium text-indigo-600 hover:underline">
            {showAnswer ? "정답·해설 숨기기" : "정답·해설 보기"}
          </button>
        )}
        {revealed && (
          <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-4 text-sm">
            <p>
              <span className="font-semibold">정답: </span>
              {isMC ? `${LABELS[question.answer as number]} ${question.options![question.answer as number]}` : question.answer}
            </p>
            {question.explanation && (
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">해설: </span>
                {question.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
