# TodoList Frontend

TodoList API를 테스트하기 위한 **공통 프론트엔드** 클라이언트입니다.

모든 백엔드(Vanilla, Express, NestJS, Fastify)와 호환됩니다.

---

## 특징

- **순수 HTML/CSS/JavaScript** - 프레임워크 없음
- **모든 백엔드 호환** - API 서버 URL 변경만으로 전환
- **반응형 디자인** - 모바일/데스크톱 지원
- **직관적 UI** - Todo CRUD 및 필터링

---

## 빠른 시작

### 방법 1: 파일 직접 열기

```bash
# 브라우저에서 index.html 파일을 직접 열기
# Windows
start Frontend/index.html

# macOS
open Frontend/index.html

# Linux
xdg-open Frontend/index.html
```

### 방법 2: Live Server 사용 (VSCode)

1. VSCode에서 `index.html` 열기
2. 우클릭 → "Open with Live Server"
3. 브라우저에서 자동으로 열림

### 방법 3: Python 간이 서버

```bash
cd Frontend

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

그 후 `http://localhost:8080` 접속

### 방법 4: Node.js 간이 서버

```bash
# npx로 바로 실행
npx serve Frontend

# 또는 http-server 사용
npx http-server Frontend -p 8080
```

---

## 사용 방법

### 1. 백엔드 서버 실행

원하는 백엔드를 먼저 실행합니다:

```bash
# Vanilla
cd Vanilla && npm start

# Express
cd Express && npm install && npm start

# NestJS (추후)
cd NestJS && npm install && npm start

# Fastify (추후)
cd Fastify && npm install && npm start
```

### 2. 프론트엔드 실행

`index.html`을 브라우저에서 엽니다.

### 3. 서버 연결

1. **API Server** 입력란에 백엔드 URL 입력 (기본: `http://localhost:3000`)
2. **Connect** 버튼 클릭
3. 상태가 **Connected**로 변경되면 연결 성공

### 4. Todo 관리

| 기능 | 사용법 |
|------|--------|
| 생성 | 제목/설명 입력 후 "Add Todo" 클릭 |
| 완료 토글 | 체크박스(원형) 클릭 |
| 수정 | ✏️ 버튼 클릭 → 모달에서 수정 |
| 삭제 | 🗑️ 버튼 클릭 → 확인 |
| 필터링 | All / Active / Completed 버튼 |

---

## 기능

### Todo CRUD
- **Create**: 제목(필수), 설명(선택) 입력 후 생성
- **Read**: 전체 목록 조회, 필터링
- **Update**: 제목, 설명 수정
- **Delete**: 삭제 (확인 필요)

### 완료 상태 토글
- 체크박스 클릭으로 완료/미완료 전환
- 완료된 항목은 취소선 표시

### 필터링
- **All**: 모든 Todo
- **Active**: 미완료 Todo
- **Completed**: 완료된 Todo

### 서버 연결
- API 서버 URL 변경 가능
- 연결 상태 실시간 표시
- 자동 재연결 시도

---

## 파일 구조

```
Frontend/
├── index.html    # UI 구조
├── style.css     # 스타일
├── app.js        # API 통신 및 로직
└── README.md     # 이 문서
```

---

## API 호환성

이 프론트엔드는 다음 API 명세를 따르는 모든 백엔드와 호환됩니다:

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/todos` | 전체 조회 |
| POST | `/todos` | 생성 |
| GET | `/todos/:id` | 단일 조회 |
| PUT | `/todos/:id` | 전체 수정 |
| PATCH | `/todos/:id` | 부분 수정 |
| DELETE | `/todos/:id` | 삭제 |
| PATCH | `/todos/:id/toggle` | 토글 |

### 응답 형식

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

---

## CORS 설정

백엔드에서 CORS를 허용해야 합니다.

### Vanilla/Express

현재 구현에는 CORS 설정이 없어 같은 origin에서만 작동합니다.

CORS가 필요한 경우 백엔드에 추가:

```javascript
// Express
const cors = require('cors');
app.use(cors());

// Vanilla - 응답 헤더에 추가
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### 개발 시 우회 방법

1. **같은 포트에서 서빙**: 백엔드에서 Frontend 폴더를 static으로 서빙
2. **브라우저 CORS 비활성화** (개발용)
3. **Live Server 프록시 설정**

---

## 트러블슈팅

### "Cannot connect to server" 에러

1. 백엔드 서버가 실행 중인지 확인
2. URL이 올바른지 확인 (예: `http://localhost:3000`)
3. CORS 설정 확인

### Todo가 표시되지 않음

1. 브라우저 개발자 도구(F12) → Network 탭 확인
2. API 응답 형식이 올바른지 확인
3. Console 에러 확인

### 스타일이 깨짐

1. `style.css` 파일이 같은 폴더에 있는지 확인
2. 브라우저 캐시 삭제 (Ctrl+Shift+R)

---

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)**: Fetch API, async/await
- **No Framework**: 순수 Vanilla JS

---

## 스크린샷

```
┌──────────────────────────────────────┐
│           TodoList                   │
│      JavaScript Backend Bible        │
├──────────────────────────────────────┤
│ API Server: [http://localhost:3000]  │
│ [Connect] ● Connected                │
├──────────────────────────────────────┤
│ [What needs to be done?           ]  │
│ [Description (optional)           ]  │
│ [         Add Todo                ]  │
├──────────────────────────────────────┤
│ [All] [Active] [Completed]  3 items  │
├──────────────────────────────────────┤
│ ○ Node.js 공부하기              ✏️ 🗑️ │
│   Express와 NestJS 비교                │
│   Created: 2024. 1. 29. 오전 10:00    │
├──────────────────────────────────────┤
│ ● Express 버전 구현 완료        ✏️ 🗑️ │
│   미들웨어 체인 이해                    │
│   Created: 2024. 1. 28. 오후 3:00     │
└──────────────────────────────────────┘
```

---

## 관련 문서

- [../00-Design/API-Specification.md](../00-Design/Api_specification.md) - API 명세서
- [../Vanilla/README.md](../Vanilla/README.md) - Vanilla 백엔드
- [../Express/README.md](../Express/README.md) - Express 백엔드

---

**"하나의 프론트엔드, 모든 백엔드"**
