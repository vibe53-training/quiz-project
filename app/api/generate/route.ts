import { NextResponse } from "next/server";
import { generateQuiz } from "@/lib/ai";
import { LIMITS, type Difficulty, type GenerateRequest, type QuestionType } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const TYPES: QuestionType[] = ["multiple_choice", "short_answer"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function parseRequest(body: unknown): GenerateRequest | string {
  const b = (body ?? {}) as Record<string, unknown>;
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const unit = typeof b.unit === "string" ? b.unit.trim() : "";
  const count = Number(b.count ?? 5);
  const type = b.type as QuestionType;
  const difficulty = (b.difficulty ?? "medium") as Difficulty;

  if (!subject || subject.length > LIMITS.textMax) return `과목은 1~${LIMITS.textMax}자로 입력해주세요.`;
  if (!unit || unit.length > LIMITS.textMax) return `단원명은 1~${LIMITS.textMax}자로 입력해주세요.`;
  if (!TYPES.includes(type)) return "문제 유형이 올바르지 않습니다.";
  if (!DIFFICULTIES.includes(difficulty)) return "난이도가 올바르지 않습니다.";
  if (!Number.isInteger(count) || count < LIMITS.countMin || count > LIMITS.countMax) {
    return `문항 수는 ${LIMITS.countMin}~${LIMITS.countMax} 사이여야 합니다.`;
  }
  return { subject, unit, type, count, difficulty };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = parseRequest(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  try {
    const quiz = await generateQuiz(parsed);
    return NextResponse.json(quiz);
  } catch (err) {
    console.error("[generate] error:", err);
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `문제 생성에 실패했습니다. 잠시 후 다시 시도해주세요. (${message})` },
      { status: 502 },
    );
  }
}
