# 개발 현황

## 현재 단계: Phase 5 - Vercel 배포 (진행 대기)

| Phase | 상태 | 비고 |
|---|---|---|
| 0. 셋업 | ✅ 완료 | Next.js 16 / React 19 / Tailwind 4 / openai 7 수동 구성 |
| 1. AI 연동 | ✅ 완료 | `/api/generate`, JSON 응답 검증 + 1회 재시도 |
| 2. UI | ✅ 완료 | 입력 폼, 문제 카드, 채점, 정답·해설, 다시 생성/풀기 |
| 3. 로컬 검증 | ✅ 완료 | 빌드 통과, API·브라우저 테스트 통과 |
| 4. GitHub | ✅ 완료 | https://github.com/vibe53-training/quiz-project (`main`) |
| 5. Vercel 배포 | 🔄 진행 중 | Vercel Import 및 환경변수 등록 필요 |

## 작업 로그

### 2026-11-21
- 한 일:
  - `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` 작성 및 의존성 설치
  - `.env.local` 생성(`env_local.txt` 복사), `.gitignore`에 `.env*.local`, `env_local.txt` 추가, `.env.example` 작성
  - `lib/types.ts`, `lib/ai.ts`(프롬프트·응답 검증·재시도), `app/api/generate/route.ts`(입력 검증) 구현
  - `components/QuizForm.tsx`, `components/QuestionCard.tsx`, `app/page.tsx`, `app/layout.tsx` 구현
  - `npm run build` 성공
  - API 테스트: 빈 과목 → 400, 객관식 3문항 → 200, 주관식 2문항 → 200
  - 브라우저 테스트: 사회/민주주의 객관식 5문항 생성 → 보기 선택 → 채점(점수·정답/오답 표시) 정상
  - README 작성, `git init -b main` 및 `git add` 완료 (비밀 파일 제외 확인)
  - `AGENTS.md`는 `next dev`가 자동 생성하는 파일로 커밋 대상에 포함
- 이슈:
  - PowerShell 실행 정책으로 `npm` 실행 불가 → `npm.cmd` 사용
  - 폴더명 공백으로 `create-next-app` 대신 수동 구성
  - 문제 생성에 약 15~25초 소요 (5문항 기준)
  - Git 사용자 정보 미설정 → `git config --global`로 설정 후 첫 커밋(`eef9a6c`)
  - 에이전트 실행 환경에서는 GitHub 로그인 창을 띄울 수 없어, 사용자 PowerShell 창에서 로그인 후 push 완료
- 다음 할 일:
  - Vercel에서 GitHub 저장소 Import
  - 환경변수(`AI_ENDPOINT`, `AI_API_KEY`, `AI_DEPLOYMENT`) 등록 후 배포 확인
