# 🤖 AI 부업 스캐너

사용자의 기술과 상황에 맞는 현실적인 부업을 AI가 추천하고, 상세한 실행 가이드를 제공하는 Firebase 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

- **무료 부업 추천**: 사용자 정보 기반으로 3가지 맞춤 부업 추천
- **상세 실행 리포트**: 선택한 부업의 단계별 실행 가이드 (마크다운 다운로드)
- **현실적 수익 예측**: 초기/3개월/6개월 수익 예상치 제공
- **즉시 사용 가능**: 별도 가입 없이 바로 사용 가능

## 🏗️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Functions (TypeScript)
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Firebase Hosting
- **Validation**: Zod

## 📁 프로젝트 구조

```
project-side-hustle-scanner/
├─ functions/
│  ├─ src/
│  │  └─ index.ts          # Firebase Functions (추천 & 리포트 생성)
│  ├─ package.json
│  └─ tsconfig.json
├─ hosting/
│  └─ index.html           # 메인 UI 페이지
├─ firebase.json           # Firebase 설정
├─ .firebaserc            # Firebase 프로젝트 설정
└─ README.md
```

## 🚀 빠른 시작

### 1. 사전 준비

```bash
# Node.js 18+ 설치 확인
node --version

# Firebase CLI 설치
npm install -g firebase-tools

# OpenAI API 키 준비
# https://platform.openai.com/api-keys
```

### 2. 프로젝트 설정

```bash
# Firebase 로그인
firebase login

# 새 프로젝트 생성 (또는 기존 프로젝트 사용)
firebase projects:create your-project-name
firebase use your-project-name

# .firebaserc 파일의 프로젝트 ID 업데이트
```

### 3. 의존성 설치

```bash
cd functions
npm install
cd ..
```

### 4. 환경 변수 설정

```bash
# OpenAI API 키를 Firebase Functions Secret으로 설정
firebase functions:secrets:set OPENAI_API_KEY
# 프롬프트에서 API 키 입력
```

### 5. 로컬 테스트

```bash
# Functions 빌드
cd functions
npm run build
cd ..

# 로컬 에뮬레이터 실행
firebase emulators:start
```

브라우저에서 `http://localhost:5000` 접속하여 테스트

### 6. 배포

```bash
# 전체 배포
firebase deploy

# 또는 개별 배포
firebase deploy --only hosting
firebase deploy --only functions
```

## 🔧 API 엔드포인트

### POST /recommend
사용자 정보를 받아 부업 3가지를 추천합니다.

**Request Body:**
```json
{
  "skills": "영상편집, 엑셀",
  "hours_per_week": 10,
  "online_or_offline": "online",
  "risk_level": "low",
  "age": 25,
  "occupation": "직장인"
}
```

**Response:**
```json
{
  "items": [
    {
      "title": "유튜브 편집",
      "difficulty": "중급",
      "monthly_estimate": "₩300,000~₩800,000",
      "one_line_tip": "크몽에 포트폴리오 올리고 소액 의뢰부터 시작"
    }
  ]
}
```

### POST /generateReport
선택한 부업의 상세 실행 가이드를 생성합니다.

**Request Body:**
```json
{
  "user": {
    "skills": "영상편집",
    "hours_per_week": 10,
    "online_or_offline": "online",
    "risk_level": "low"
  },
  "chosen_title": "유튜브 편집"
}
```

**Response:**
```json
{
  "markdown": "# 유튜브 편집 부업 가이드\n\n## 개요\n..."
}
```

## 💰 비용 구조

### Firebase
- **Hosting**: 무료 (월 10GB, 10GB 전송)
- **Functions**: 무료 (월 200만 호출, 40만 GB-초)

### OpenAI
- **GPT-4o-mini**: $0.15/1M input tokens, $0.60/1M output tokens
- 예상 비용: 월 1000명 사용 시 약 $5-10

## 🔒 보안 고려사항

1. **API 키 보안**: Firebase Functions Secret 사용
2. **CORS 설정**: 허용된 도메인만 접근 가능
3. **입력 검증**: Zod를 통한 엄격한 데이터 검증
4. **에러 처리**: 민감한 정보 노출 방지

## 📈 확장 계획

### Phase 1: 결제 시스템
- Stripe Checkout 연동
- 리포트 유료화 (₩2,000)

### Phase 2: 사용자 관리
- Firebase Auth 연동
- 사용자별 추천 히스토리

### Phase 3: 고도화
- 실시간 수익 추적
- 커뮤니티 기능
- 모바일 앱

## 🐛 문제 해결

### Functions 배포 실패
```bash
# Functions 로그 확인
firebase functions:log

# 로컬에서 테스트
firebase emulators:start --only functions
```

### OpenAI API 오류
- API 키가 올바르게 설정되었는지 확인
- OpenAI 계정의 사용량 한도 확인
- Functions Secret이 올바르게 설정되었는지 확인

### CORS 오류
- Functions에서 CORS 헤더가 올바르게 설정되었는지 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

## 📞 지원

문제가 발생하거나 개선 사항이 있으시면 이슈를 등록해 주세요.

## 📄 라이선스

MIT License

---

**주의사항**: 이 서비스는 참고용이며, 실제 수익을 보장하지 않습니다. 투자나 사업 결정은 신중히 하시기 바랍니다.
