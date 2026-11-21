# 개발 계획서: AI 퀴즈 생성 웹앱

> 관련 문서: [PRD.md](./PRD.md)  
> 개발 진행 현황은 코드 작성 시작 시 [STATUS.md](./STATUS.md)에 기록한다.

## 1. 개발 원칙
- **로컬 우선**: 로컬에서 전체 기능 검증 → GitHub 푸시 → Vercel 배포
- **보안 우선**: API 키는 서버 측에서만 사용, 비밀 파일은 절대 커밋하지 않음
- **현황 기록**: 각 단계 시작/완료 시 `STATUS.md` 업데이트 (작업 내용, 완료 여부, 이슈, 다음 할 일)

## 2. 아키텍처
```
[브라우저 (React UI)]
        │  POST /api/generate  { subject, unit, type, count, difficulty }
        ▼
[Next.js API Route (서버)]  ← 환경변수 AI_ENDPOINT / AI_API_KEY / AI_DEPLOYMENT
        │  openai SDK (chat.completions, JSON 응답)
        ▼
[Azure AI (OpenAI 호환 v1)]
```

## 3. 예상 폴더 구조
```
quiz project/
├─ app/
│  ├─ page.tsx              # 메인 화면 (입력 폼 + 결과)
│  ├─ layout.tsx
│  └─ api/generate/route.ts # 문제 생성 API
├─ components/
│  ├─ QuizForm.tsx
│  └─ QuestionCard.tsx
├─ lib/
│  ├─ ai.ts                 # AI 클라이언트 및 프롬프트
│  └─ types.ts              # 문제 타입 정의
├─ .env.local               # (Git 제외) 로컬 환경변수
├─ .env.example             # 변수 이름만 기재
├─ .gitignore
├─ PRD.md
├─ DEVELOPMENT_PLAN.md
├─ STATUS.md
└─ README.md
```

## 4. 단계별 작업 계획

### Phase 0. 프로젝트 셋업
- [ ] Next.js + TypeScript + Tailwind 프로젝트 생성
- [ ] `openai` 패키지 설치
- [ ] `env_local.txt` 내용을 `.env.local`로 이전
- [ ] `.gitignore`에 `.env*.local`, `env_local.txt` 추가
- [ ] `.env.example` 작성 (값 없이 변수 이름만)
- [ ] `STATUS.md` 생성

### Phase 1. AI 연동 (백엔드)
- [ ] `lib/ai.ts`: `new OpenAI({ baseURL: AI_ENDPOINT, apiKey: AI_API_KEY })`
- [ ] 시스템/유저 프롬프트 작성 (객관식/주관식별, 난이도 반영, JSON 스키마 명시)
- [ ] `app/api/generate/route.ts`: 입력 검증 → AI 호출 → JSON 파싱/검증 → 반환
- [ ] 파싱 실패 시 1회 재시도, 에러 시 적절한 HTTP 상태 코드 반환
- [ ] curl/PowerShell로 API 단독 테스트

### Phase 2. UI (프론트엔드)
- [ ] 입력 폼: 과목, 단원명, 유형, 문항 수, 난이도
- [ ] 로딩 상태 / 에러 메시지
- [ ] 문제 카드: 객관식 보기 선택, 주관식 입력
- [ ] 채점 및 정답·해설 토글
- [ ] 다시 생성 버튼
- [ ] 반응형 레이아웃

### Phase 3. 로컬 검증
- [ ] `npm run dev`로 실행 후 브라우저 테스트
- [ ] 테스트 시나리오
  - 객관식 5문항 생성 / 주관식 5문항 생성
  - 빈 입력, 50자 초과 입력 시 검증 메시지
  - 잘못된 API 키 시 에러 처리
- [ ] `npm run build`, `npm run lint` 통과

### Phase 4. GitHub 업로드
- [ ] `git init`, 커밋 전 **비밀 파일 미포함 확인** (`git status`)
- [ ] GitHub 저장소 생성 및 푸시
- [ ] `README.md`에 실행 방법 작성

### Phase 5. Vercel 배포
- [ ] Vercel에서 GitHub 저장소 Import
- [ ] Environment Variables에 `AI_ENDPOINT`, `AI_API_KEY`, `AI_DEPLOYMENT` 등록
- [ ] 배포 후 프로덕션 URL에서 동작 확인
- [ ] 필요 시 API Route `maxDuration` 조정
- [ ] 이후 `main` 브랜치 푸시 시 자동 배포 확인

## 5. 일정 (예상)
| Phase | 내용 | 예상 소요 |
|---|---|---|
| 0 | 셋업 | 0.5일 |
| 1 | AI 연동 | 1일 |
| 2 | UI | 1일 |
| 3 | 로컬 검증 | 0.5일 |
| 4 | GitHub | 0.25일 |
| 5 | Vercel 배포 | 0.25일 |
| | **합계** | **약 3.5일** |

## 6. STATUS.md 작성 규칙
코드 작성이 시작되면 아래 형식으로 기록한다.
```markdown
# 개발 현황

## 현재 단계: Phase N - 이름

| Phase | 상태 | 비고 |
|---|---|---|
| 0. 셋업 | ✅ 완료 / 🔄 진행 중 / ⏳ 대기 | |

## 작업 로그
### YYYY-MM-DD
- 한 일:
- 이슈:
- 다음 할 일:
```

## 7. 보안 체크리스트
- [ ] API 키가 클라이언트 번들에 포함되지 않음 (`NEXT_PUBLIC_` 접두사 사용 금지)
- [ ] `env_local.txt`, `.env.local`이 Git에 없음
- [ ] 키가 문서/README/커밋 로그에 노출되지 않음
- [ ] 노출 의심 시 Azure 포털에서 키 재발급
