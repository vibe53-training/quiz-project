"use client";

import { useState } from "react";
import { DIFFICULTY_LABEL, LIMITS, type Difficulty, type GenerateRequest, type QuestionType } from "@/lib/types";

interface Props {
  loading: boolean;
  onSubmit: (req: GenerateRequest) => void;
}

export default function QuizForm({ loading, onSubmit }: Props) {
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [type, setType] = useState<QuestionType>("multiple_choice");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const canSubmit = subject.trim() && unit.trim() && !loading;

  return (
    <form
      className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit({ subject: subject.trim(), unit: unit.trim(), type, count, difficulty });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">과목</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="예: 과학"
            maxLength={LIMITS.textMax}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">단원명</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="예: 광합성"
            maxLength={LIMITS.textMax}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <fieldset>
          <legend className="mb-1 text-sm font-medium">문제 유형</legend>
          <div className="flex gap-2">
            {(
              [
                ["multiple_choice", "객관식"],
                ["short_answer", "주관식"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm ${
                  type === value ? "border-indigo-500 bg-indigo-50 font-semibold text-indigo-700" : "border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  className="sr-only"
                  checked={type === value}
                  onChange={() => setType(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">문항 수</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {Array.from({ length: LIMITS.countMax }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}문항
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">난이도</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "문제 생성 중..." : "문제 생성"}
      </button>
    </form>
  );
}
