# TodoList API - Vanilla Node.js

순수 Node.js만으로 구현한 TodoList RESTful API입니다.

**외부 라이브러리 없이** Node.js 내장 모듈만 사용하여 HTTP 서버, 라우팅, JSON 파싱 등을 직접 구현했습니다.

---

## 요구사항

- **Node.js 18.0.0** 이상

```bash
# Node.js 버전 확인
node --version
```

---

## 빠른 시작

### 1. 설치

```bash
# 프로젝트 폴더로 이동
cd Vanilla

# 의존성 설치 (없음 - 순수 Node.js)
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
  TodoList API Server (Vanilla)
==================================================
  Environment: development

Loading data...

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
    "title": "Node.js 공부하기",
    "description": "Vanilla 구현 완료"
  }'
```

**응답 (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Node.js 공부하기",
    "description": "Vanilla 구현 완료",
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
Vanilla/
├── server.js                 # 서버 진입점
├── package.json              # 프로젝트 설정
├── config/
│   └── config.js             # 환경 설정
├── routes/
│   └── todoRoutes.js         # 라우팅 (수동 URL 매칭)
├── controllers/
│   └── todoController.js     # 요청/응답 처리
├── services/
│   └── todoService.js        # 비즈니스 로직
├── repositories/
│   └── todoRepository.js     # 데이터 접근 (메모리 + 파일)
├── models/
│   └── Todo.js               # Todo 모델 정의
├── middlewares/
│   ├── jsonParser.js         # JSON 파싱
│   ├── logger.js             # 요청 로깅
│   └── errorHandler.js       # 에러 처리
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
│     Server (server.js)        │  서버 생성 및 관리
└───────────────────────────────┘
    │
    ↓
┌───────────────────────────────┐
│   Router (todoRoutes.js)      │  URL 패턴 매칭 (if-else)
└───────────────────────────────┘
    │
    ↓
┌───────────────────────────────┐
│  Middleware                   │  JSON 파싱, 로깅, 에러 처리
│  (jsonParser, logger, etc.)   │
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

### 설정 파일

`config/config.js`에서 서버 설정을 관리합니다.

---

## Vanilla 구현의 학습 포인트

### 1. HTTP 서버 직접 생성

```javascript
const http = require('http');
const server = http.createServer(router);
server.listen(3000);
```

### 2. 수동 라우팅

```javascript
function router(req, res) {
  if (method === 'POST' && url === '/todos') {
    return todoController.createTodo(req, res);
  }
  // ...
}
```

### 3. JSON 파싱 직접 구현

```javascript
function parseJSON(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    req.body = JSON.parse(body);
    callback();
  });
}
```

### 4. 응답 헬퍼 직접 작성

```javascript
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
```

---

## 프레임워크 비교

| 항목 | Vanilla | Express |
|------|---------|---------|
| 라우팅 | 수동 (if-else) | `app.get()`, `app.post()` |
| JSON 파싱 | 직접 구현 | `express.json()` |
| 미들웨어 | 직접 구현 | 체인 방식 |
| 코드량 | 많음 | 적음 |
| 학습 가치 | 원리 이해 | 생산성 |

---

## 관련 문서

- [Requirements.md](../00-Design/Requirements.md) - 요구사항 정의
- [API-Specification.md](../00-Design/Api_specification.md) - API 명세서
- [ERD.md](../00-Design/Erd.md) - 데이터 모델
- [Architecture.md](./Architecture.md) - 상세 아키텍처

---

## 다음 단계

Vanilla 구현을 이해했다면, 다음 프레임워크로 진행하세요:

1. **Express** - 미들웨어 체인, 간편한 라우팅
2. **NestJS** - TypeScript, 데코레이터, 의존성 주입
3. **Fastify** - 고성능, 스키마 기반 검증

---

**"프레임워크가 해주는 일을 직접 구현해보면, 프레임워크를 더 잘 이해할 수 있다"**
