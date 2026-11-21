# AI 퀴즈 생성기

과목과 단원명을 입력하면 AI가 객관식·주관식 문제(정답·해설 포함)를 출제하는 웹앱입니다.

- 문서: [PRD](./PRD.md) · [개발 계획](./DEVELOPMENT_PLAN.md) · [개발 현황](./STATUS.md)
- 스택: Next.js (App Router) + TypeScript + Tailwind CSS + `openai` SDK (Azure AI OpenAI 호환 v1)

## 로컬 실행
```bash
npm install
cp .env.example .env.local   # 값 입력
npm run dev                  # http://localhost:3000
```

> Windows PowerShell에서 `npm` 실행 정책 오류가 나면 `npm.cmd`를 사용하세요.

## 환경 변수
| 이름 | 설명 |
|---|---|
| `AI_ENDPOINT` | OpenAI 호환 v1 엔드포인트 (예: `https://<resource>.services.ai.azure.com/openai/v1`) |
| `AI_API_KEY` | API 키 (절대 커밋 금지) |
| `AI_DEPLOYMENT` | 모델 배포명 |

## API
`POST /api/generate`
```json
{ "subject": "과학", "unit": "광합성", "type": "multiple_choice", "count": 5, "difficulty": "medium" }
```
- `type`: `multiple_choice` | `short_answer`
- `count`: 1~10, `difficulty`: `easy` | `medium` | `hard`

## Vercel 배포
1. GitHub 저장소를 Vercel에서 Import
2. Settings → Environment Variables에 위 3개 변수 등록
3. Deploy
