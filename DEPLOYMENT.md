# 🚀 배포 가이드

Firebase AI 부업 스캐너를 배포하는 단계별 가이드입니다.

## 📋 사전 체크리스트

- [ ] Node.js 18+ 설치됨
- [ ] Firebase CLI 설치됨 (`npm install -g firebase-tools`)
- [ ] OpenAI API 키 준비됨
- [ ] Google 계정 (Firebase 로그인용)

## 🔧 1단계: Firebase 프로젝트 생성

```bash
# Firebase CLI 로그인
firebase login

# 새 프로젝트 생성
firebase projects:create your-project-name

# 프로젝트 선택
firebase use your-project-name
```

**중요**: `.firebaserc` 파일의 프로젝트 ID를 실제 생성한 프로젝트 ID로 업데이트하세요.

## 🔑 2단계: OpenAI API 키 설정

```bash
# Firebase Functions Secret으로 API 키 설정
firebase functions:secrets:set OPENAI_API_KEY

# 프롬프트가 나타나면 OpenAI API 키 입력
# 예: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📦 3단계: 의존성 설치

```bash
# Functions 디렉터리로 이동
cd functions

# 의존성 설치
npm install

# 루트 디렉터리로 돌아가기
cd ..
```

## 🧪 4단계: 로컬 테스트

```bash
# Functions 빌드
cd functions
npm run build
cd ..

# 로컬 에뮬레이터 실행
firebase emulators:start
```

브라우저에서 `http://localhost:5000`에 접속하여 테스트:
1. 기술 키워드 입력 (예: "영상편집, 엑셀")
2. "무료로 추천 받기" 버튼 클릭
3. 추천 결과 확인
4. 리포트 다운로드 테스트

## 🌐 5단계: 배포

### 전체 배포
```bash
firebase deploy
```

### 개별 배포
```bash
# Hosting만 배포
firebase deploy --only hosting

# Functions만 배포
firebase deploy --only functions
```

## ✅ 6단계: 배포 확인

배포 완료 후 제공되는 URL로 접속:
- **Hosting URL**: `https://your-project-name.web.app`
- **Functions URL**: `https://us-central1-your-project-name.cloudfunctions.net`

### 테스트 시나리오

1. **기본 기능 테스트**
   - 기술 키워드: "영상편집, 블로그"
   - 주당 시간: 10시간
   - 추천 결과 3개 확인

2. **리포트 생성 테스트**
   - 추천된 부업 중 하나 선택
   - 리포트 다운로드 확인
   - 마크다운 파일 내용 검토

3. **에러 처리 테스트**
   - 빈 기술 키워드로 제출
   - 네트워크 오류 상황 시뮬레이션

## 🔍 7단계: 모니터링 설정

### Firebase Console에서 확인
1. **Functions**: 실행 횟수, 에러율, 응답 시간
2. **Hosting**: 트래픽, 에러 로그
3. **Logs**: 실시간 로그 모니터링

### 로그 확인 명령어
```bash
# Functions 로그 실시간 확인
firebase functions:log --follow

# 특정 함수 로그만 확인
firebase functions:log --only recommend
```

## 🚨 문제 해결

### Functions 배포 실패
```bash
# 에러 로그 확인
firebase functions:log

# 로컬에서 다시 테스트
firebase emulators:start --only functions
```

### OpenAI API 오류
1. API 키 확인: `firebase functions:secrets:access OPENAI_API_KEY`
2. OpenAI 계정 사용량 확인
3. Functions 재배포: `firebase deploy --only functions`

### CORS 오류
- Functions 코드에서 CORS 헤더 확인
- 브라우저 개발자 도구 네트워크 탭 확인

### Hosting 배포 실패
```bash
# Hosting 캐시 클리어
firebase hosting:channel:delete preview

# 다시 배포
firebase deploy --only hosting
```

## 📊 성능 최적화

### Functions 최적화
- Cold start 최소화를 위한 최소한의 의존성
- 메모리 사용량 모니터링
- 타임아웃 설정 (기본 60초)

### Hosting 최적화
- 정적 파일 압축
- CDN 캐싱 활용
- 이미지 최적화 (필요시)

## 🔒 보안 체크리스트

- [ ] OpenAI API 키가 Secret으로 설정됨
- [ ] CORS 설정이 올바름
- [ ] 입력 검증이 구현됨
- [ ] 에러 메시지에 민감한 정보 없음
- [ ] Firebase 보안 규칙 설정 (필요시)

## 📈 확장 준비

### 결제 시스템 추가 시
1. Stripe 계정 생성
2. Webhook 엔드포인트 추가
3. 결제 성공 후 리포트 생성 로직 수정

### 사용자 관리 추가 시
1. Firebase Auth 활성화
2. 사용자별 데이터 저장 (Firestore)
3. 인증 미들웨어 추가

## 🎯 배포 후 체크리스트

- [ ] 웹사이트 정상 접속
- [ ] 부업 추천 기능 작동
- [ ] 리포트 다운로드 기능 작동
- [ ] 모바일 반응형 확인
- [ ] 로딩 시간 측정 (3초 이내)
- [ ] 에러 처리 확인

## 📞 지원

배포 중 문제가 발생하면:
1. Firebase Console에서 로그 확인
2. GitHub Issues에 문제 보고
3. Firebase 지원팀 문의 (유료 플랜)

---

**성공적인 배포를 위해 각 단계를 차근차근 진행하세요!** 🚀
