# Dog Mind Prototype

반려견의 사진/30초 이하 영상, 현재 상황, 저장된 개별 특징, 일반적인 개 행동 지식과 견종 보조 정보를 조합해 가능한 감정과 욕구를 추정하는 웹 프로토타입입니다.

## 핵심 원칙

- 실제 생각을 읽는다고 주장하지 않습니다.
- 현재 관찰되는 행동을 가장 우선합니다.
- 견종 특성은 약한 보조 정보로만 사용합니다.
- 등록되지 않은 강아지는 견종을 추정하지 않습니다.
- 결과는 `높음 / 보통 / 낮음` 확신도로 표현하고 퍼센트를 만들지 않습니다.
- 사진/영상 원본은 DB에 저장하지 않습니다.
- 영상은 FFmpeg로 최대 8개 프레임으로 변환해 이미지 입력으로 분석합니다.

## 실행 준비

1. Node.js 22+와 FFmpeg/FFprobe가 설치되어 있어야 합니다.
2. `.env.example`을 `.env.local`과 `.env`로 복사합니다.
3. `OPENAI_API_KEY`는 나중에 발급받은 키를 넣습니다.
4. 패키지를 설치합니다.

```bash
npm install
```

5. Prisma Client 생성 및 SQLite 초기화:

```bash
npm run db:generate
npm run db:deploy
```

개발 서버:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 회원가입 → 강아지 등록 또는 등록되지 않은 강아지 분석 순서로 사용합니다.

## 환경 변수

```env
DATABASE_URL="file:./prisma/app.db"
OPENAI_API_KEY="sk-..."
DOG_ANALYSIS_MODEL="gpt-5.6-luna"
SESSION_COOKIE_NAME="dog_mind_session"
```

## 현재 프로토타입 범위

- 간단 아이디/비밀번호 회원가입 및 로그인
- Argon2id 비밀번호 해시
- DB 세션 + HttpOnly 쿠키
- SQLite 파일 DB
- 강아지 등록
- 개별 특징 저장
- 사진 분석
- 30초 이하 영상 분석 (FFmpeg 프레임 추출)
- OpenAI Responses API + Structured Outputs
- 분석 기록
- 맞음/아님 피드백

## 아직 의도적으로 단순한 부분

- 견종 지식 DB는 샘플 3종만 포함합니다. 자료 출처 검토 후 확장해야 합니다.
- AI가 제안한 특징을 UI에서 승인해 저장하는 흐름은 다음 세로 슬라이스에서 연결합니다.
- 실제 공개 배포를 위한 CSRF/레이트리밋/계정 복구/운영 로깅은 프로토타입 이후 단계입니다.
