# TodoList API - Express

Express로 구현한 TodoList RESTful API입니다.

**미들웨어 체인**과 **Express Router**를 활용하여 Vanilla Node.js 대비 간결한 코드로 동일한 기능을 구현했습니다.

---

## 요구사항

- **Node.js 18.0.0** 이상
- **npm** 또는 **yarn**

```bash
# Node.js 버전 확인
node --version
```

---

## 빠른 시작

### 1. 설치

```bash
# 프로젝트 폴더로 이동
cd Express

# 의존성 설치
npm install
```

### 2. 서버 실행

```bash
# 프로덕션 모드
npm start

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev
```

### 3. 서버 확인

```
==================================================
  TodoList API Server (Express)
==================================================
  Environment: development

Loading data...
  No existing data file, starting fresh

  Server running at: http://localhost:3000
==================================================

Available endpoints:
  POST   /todos           - Create a new todo
  GET    /todos           - Get all todos
  GET    /todos/:id       - Get a specific todo
  PUT    /todos/:id       - Update a todo (full)
  PATCH  /todos/:id       - Update a todo (partial)
  DELETE /todos/:id       - Delete a todo
  PATCH  /todos/:id/toggle - Toggle todo completion

Press Ctrl+C to stop the server
==================================================
```

---

## API 테스트

### cURL 사용

#### 1. Todo 생성

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Express 학습하기",
    "description": "미들웨어와 라우터 이해"
  }'
```

**응답 (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Express 학습하기",
    "description": "미들웨어와 라우터 이해",
    "completed": false,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

#### 2. Todo 목록 조회

```bash
curl http://localhost:3000/todos
```

#### 3. 특정 Todo 조회

```bash
curl http://localhost:3000/todos/{id}
```

#### 4. Todo 수정 (전체)

```bash
curl -X PUT http://localhost:3000/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "수정된 제목",
    "description": "수정된 설명",
    "completed": true
  }'
```

#### 5. Todo 수정 (부분)

```bash
curl -X PATCH http://localhost:3000/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "제목만 수정"
  }'
```

#### 6. Todo 완료 상태 토글

```bash
curl -X PATCH http://localhost:3000/todos/{id}/toggle
```

#### 7. Todo 삭제

```bash
curl -X DELETE http://localhost:3000/todos/{id}
```

---

## 프로젝트 구조

```
Express/
├── app.js                    # Express 앱 설정
├── server.js                 # 서버 진입점
├── package.json              # 프로젝트 설정
├── config/
│   └── config.js             # 환경 설정
├── routes/
│   └── todos.js              # Express Router 라우팅
├── controllers/
│   └── todoController.js     # 요청/응답 처리
├── services/
│   └── todoService.js        # 비즈니스 로직
├── repositories/
│   └── todoRepository.js     # 데이터 접근 (메모리 + 파일)
├── models/
│   └── Todo.js               # Todo 모델 정의
├── middlewares/
│   ├── logger.js             # 요청 로깅
│   ├── errorHandler.js       # 전역 에러 처리
│   └── notFound.js           # 404 처리
└── utils/
    ├── validator.js          # 입력 검증
    ├── response.js           # 응답 헬퍼
    ├── uuid.js               # UUID 생성
    └── constants.js          # 상수 정의
```

---

## 계층 구조

```
Client (Browser, Postman, curl)
    │
    ↓ HTTP Request
    │
┌───────────────────────────────┐
│     Express App (app.js)      │  앱 설정 및 미들웨어 구성
└───────────────────────────────┘
    │
    ↓ Middleware Chain
    │
┌───────────────────────────────┐
│  logger → express.json()      │  로깅, JSON 파싱
└───────────────────────────────┘
    │
    ↓
┌───────────────────────────────┐
│   Router (routes/todos.js)    │  선언적 라우팅
│   router.post('/', handler)   │
└───────────────────────────────┘
    │
    ↓
┌───────────────────────────────┐
│  Controller                   │  요청 검증 및 응답 생성
│  (todoController.js)          │
└───────────────────────────────┘
    │
    ↓
┌───────────────────────────────┐
│  Service (todoService.js)     │  비즈니스 로직
└───────────────────────────────┘
    │
    ↓
┌───────────────────────────────┐
│  Repository                   │  데이터 저장/조회
│  (todoRepository.js)          │  (메모리 + 파일 백업)
└───────────────────────────────┘
```

---

## Vanilla vs Express 비교

| 항목 | Vanilla | Express |
|------|---------|---------|
| 라우팅 | 수동 (if-else) | `router.get()`, `router.post()` |
| JSON 파싱 | 직접 구현 | `express.json()` |
| URL 파라미터 | 수동 파싱 | `req.params.id` |
| 에러 처리 | try-catch + 응답 | `next(error)` + 미들웨어 |
| 코드량 | 많음 | 적음 |

### 코드 비교

**라우팅**:
```javascript
// Vanilla: 수동 if-else
if (method === 'POST' && url === '/todos') {
  return todoController.createTodo(req, res);
}

// Express: 선언적 라우팅
router.post('/', todoController.createTodo);
```

**JSON 파싱**:
```javascript
// Vanilla: 직접 구현
let body = '';
req.on('data', chunk => body += chunk);
req.on('end', () => req.body = JSON.parse(body));

// Express: 한 줄
app.use(express.json());
```

---

## 데이터 저장 방식

### 메모리 저장 + 파일 백업

- **런타임**: 메모리에 데이터 저장 (빠른 속도)
- **종료 시**: `data/todos.json` 파일로 백업
- **시작 시**: 파일에서 데이터 로드

### Graceful Shutdown

서버 종료 시 (`Ctrl+C`) 자동으로 데이터를 파일에 백업합니다.

```
Received SIGINT, shutting down gracefully...
Server closed
Data backup completed
```

---

## 환경 설정

### 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `NODE_ENV` | `development` | 실행 환경 |
| `PORT` | `3000` | 서버 포트 |
| `HOST` | `localhost` | 서버 호스트 |

---

## 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| express | ^4.18.2 | 웹 프레임워크 |

---

## Express 핵심 개념

### 1. 미들웨어 체인

```javascript
app.use(logger);           // 1. 로깅
app.use(express.json());   // 2. JSON 파싱
app.use('/todos', routes); // 3. 라우트
app.use(errorHandler);     // 4. 에러 처리
```

### 2. Express Router

```javascript
const router = express.Router();

router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', getTodoById);

module.exports = router;
```

### 3. 에러 핸들링

```javascript
// 컨트롤러에서 에러 전달
async function handler(req, res, next) {
  try {
    // 로직
  } catch (error) {
    next(error);  // 에러 핸들러로 전달
  }
}

// 4개 인자 미들웨어 = 에러 핸들러
function errorHandler(err, req, res, next) {
  res.status(500).json({ error: err.message });
}
```

---

## 관련 문서

- [Requirements.md](../00-Design/Requirements.md) - 요구사항 정의
- [API-Specification.md](../00-Design/Api_specification.md) - API 명세서
- [ERD.md](../00-Design/Erd.md) - 데이터 모델
- [Architecture.md](./Architecture.md) - 상세 아키텍처

---

## 다음 단계

Express 구현을 이해했다면, 다음 프레임워크로 진행하세요:

1. **NestJS** - TypeScript, 데코레이터, 의존성 주입, 모듈 시스템
2. **Fastify** - 고성능, 스키마 기반 검증

---

**"Express는 Node.js의 복잡함을 숨기고, 개발자가 비즈니스 로직에 집중하게 한다"**
