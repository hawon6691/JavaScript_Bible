# Express Architecture (아키텍처 설계)

## 🏗️ 아키텍처 개요

**Express** 버전 TodoList API의 전체 구조와 설계 원칙을 정의합니다.

### 핵심 특징
- **미들웨어 체인**: 요청 처리 파이프라인 구성
- **Express Router**: 선언적 라우팅
- **내장 JSON 파싱**: `express.json()` 미들웨어
- **간결한 코드**: Vanilla 대비 적은 코드량

---

## 📐 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Client (클라이언트)                    │
│              (Browser, Postman, curl 등)                │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Request
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Express App                          │
│                  (app.js)                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Middleware Chain                       │
│     logger → express.json() → routes → errorHandler     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   Router Layer                          │
│              (Express Router - routes/todos.js)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   Controller Layer                      │
│           (요청 처리, 검증, 응답 생성)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                        │
│              (비즈니스 로직 처리)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Repository Layer                       │
│              (데이터 접근 및 저장)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Storage                         │
│           (메모리/파일/데이터베이스)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 디렉토리 구조

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
│   └── todoController.js     # 요청 처리
├── services/
│   └── todoService.js        # 비즈니스 로직
├── repositories/
│   └── todoRepository.js     # 데이터 접근
├── models/
│   └── Todo.js               # Todo 모델 정의
├── middlewares/
│   ├── logger.js             # 요청 로깅
│   ├── errorHandler.js       # 전역 에러 처리
│   └── notFound.js           # 404 처리
├── utils/
│   ├── validator.js          # 검증 유틸리티
│   ├── response.js           # 응답 헬퍼
│   ├── uuid.js               # UUID 생성
│   └── constants.js          # 상수 정의
└── data/
    └── todos.json            # 데이터 저장 (파일)
```

---

## 🎯 계층별 책임

### 1. App Layer (앱 계층)
**책임**: Express 앱 설정 및 미들웨어 구성

```javascript
// app.js
const express = require('express');
const app = express();

// 미들웨어 체인 (순서 중요!)
app.use(logger);           // 1. 로깅
app.use(express.json());   // 2. JSON 파싱 (Express 내장)
app.use('/todos', todoRoutes);  // 3. 라우트
app.use(notFound);         // 4. 404 핸들러
app.use(errorHandler);     // 5. 에러 핸들러
```

**역할**:
- ✅ Express 인스턴스 생성
- ✅ 미들웨어 등록 (순서대로)
- ✅ 라우터 연결

---

### 2. Router Layer (라우팅 계층)
**책임**: URL 패턴과 Controller 매핑

```javascript
// routes/todos.js
const express = require('express');
const router = express.Router();

router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.put('/:id', todoController.updateTodo);
router.patch('/:id', todoController.patchTodo);
router.patch('/:id/toggle', todoController.toggleTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
```

**Vanilla와의 비교**:
```javascript
// Vanilla: 수동 if-else
if (method === 'POST' && url === '/todos') { ... }
if (method === 'GET' && url === '/todos') { ... }

// Express: 선언적 라우팅
router.post('/', handler);
router.get('/', handler);
```

---

### 3. Middleware Layer (미들웨어 계층)
**책임**: 요청 전처리 및 공통 기능

```javascript
// middlewares/logger.js
function logger(req, res, next) {
  // 요청 로깅
  console.log(`${req.method} ${req.originalUrl}`);
  next();  // 다음 미들웨어로
}

// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  // 4개 인자 = Express 에러 핸들러
  res.status(500).json({ error: err.message });
}
```

**Express 미들웨어 체인**:
```
요청 → logger → express.json() → routes → controller
                                              ↓
응답 ← errorHandler ← notFound ← (에러 발생 시)
```

---

### 4. Controller Layer (컨트롤러 계층)
**책임**: HTTP 요청/응답 처리

```javascript
// controllers/todoController.js
async function createTodo(req, res, next) {
  try {
    // 1. 입력값 검증
    const error = validator.validateCreateTodo(req.body);
    if (error) return response.badRequest(res, error);

    // 2. 서비스 호출
    const todo = await todoService.createTodo(req.body);

    // 3. 응답 전송
    return response.created(res, todo, 'Todo created');
  } catch (error) {
    next(error);  // Express 에러 핸들러로 전달
  }
}
```

**Express 장점**:
- `req.body`: 자동으로 파싱된 JSON
- `req.params`: URL 파라미터 (`/:id`)
- `next(error)`: 에러 핸들러 체인

---

### 5. Service Layer (서비스 계층)
**책임**: 비즈니스 로직 처리

```javascript
// services/todoService.js
async function createTodo(data) {
  const todo = Todo.createTodo(data);
  await todoRepository.save(todo);
  return todo;
}
```

**역할**: Vanilla와 동일
- ✅ 비즈니스 로직 구현
- ✅ Repository 호출
- ✅ 데이터 변환

---

### 6. Repository Layer (리포지토리 계층)
**책임**: 데이터 접근 및 저장

```javascript
// repositories/todoRepository.js
let todos = [];

async function save(todo) {
  todos.push(todo);
  return todo;
}

async function findAll() {
  return [...todos].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}
```

**역할**: Vanilla와 동일
- ✅ CRUD 연산 구현
- ✅ 데이터 저장소 추상화

---

## 🎨 설계 패턴

### 1. Middleware Pattern (미들웨어 패턴)
Express의 핵심 패턴

```javascript
// 요청 처리 파이프라인
app.use(middleware1);  // req → middleware1
app.use(middleware2);  // → middleware2
app.use(middleware3);  // → middleware3 → res
```

**장점**:
- ✅ 관심사 분리 (로깅, 파싱, 인증 등)
- ✅ 재사용 가능한 미들웨어
- ✅ 순서대로 실행, 쉬운 제어

---

### 2. Router Pattern (라우터 패턴)
모듈화된 라우팅

```javascript
// 기능별 라우터 분리
app.use('/todos', todoRoutes);
app.use('/users', userRoutes);  // 확장 시
app.use('/auth', authRoutes);   // 확장 시
```

---

### 3. Error-first Callback → next(error)
Express 에러 처리 패턴

```javascript
// Controller에서 에러 발생 시
async function handler(req, res, next) {
  try {
    // 비즈니스 로직
  } catch (error) {
    next(error);  // 에러 핸들러로 전달
  }
}

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## 🔄 요청 흐름 (Request Flow)

### 예시: POST /todos 요청

```
1. Client
   ↓ HTTP POST /todos

2. Express App (app.js)
   ↓ 미들웨어 체인 시작

3. Logger Middleware
   ↓ 요청 로깅 → next()

4. express.json() Middleware
   ↓ JSON 파싱 → req.body 생성 → next()

5. Router (routes/todos.js)
   ↓ POST / 매칭 → todoController.createTodo 호출

6. Controller (todoController.js)
   ↓ 입력 검증 → todoService.createTodo 호출

7. Service (todoService.js)
   ↓ Todo 객체 생성 → todoRepository.save 호출

8. Repository (todoRepository.js)
   ↓ 메모리에 저장

9. Controller
   ↓ response.created() → res.json()

10. Client
    ← HTTP 201 + JSON 응답
```

---

## 📊 Vanilla vs Express 비교

| 항목 | Vanilla | Express |
|------|---------|---------|
| **서버 생성** | `http.createServer()` | `express()` |
| **라우팅** | 수동 if-else | `router.get()`, `router.post()` |
| **JSON 파싱** | 직접 구현 | `express.json()` |
| **URL 파라미터** | 수동 파싱 | `req.params.id` |
| **에러 처리** | try-catch + 응답 | `next(error)` + 미들웨어 |
| **미들웨어** | 직접 구현 | 체인 방식 |
| **코드량** | 많음 | 적음 |
| **학습 곡선** | 기본 원리 | 프레임워크 규칙 |

### 코드 비교

**라우팅**:
```javascript
// Vanilla
function router(req, res) {
  const { method, url } = req;
  if (method === 'POST' && url === '/todos') {
    return todoController.createTodo(req, res);
  }
  // ...많은 if-else
}

// Express
router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
// 선언적, 간결
```

**JSON 파싱**:
```javascript
// Vanilla
function parseJSON(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    req.body = JSON.parse(body);
    callback();
  });
}

// Express
app.use(express.json());  // 한 줄!
```

---

## 🛡️ 에러 처리 전략

### Express 에러 핸들링

```
Controller:
  ↓ try-catch로 감싸고 next(error) 호출

Middleware:
  ↓ 4개 인자 함수가 에러 핸들러로 동작

Error Handler:
  ↓ 에러 로깅 + 안전한 응답 전송
```

```javascript
// 컨트롤러
async function handler(req, res, next) {
  try {
    // 로직
  } catch (error) {
    next(error);
  }
}

// 에러 핸들러 (4개 인자!)
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal error' });
}
```

---

## 🚀 확장 시 장점

### 미들웨어 추가 용이

```javascript
// 인증 추가
const authMiddleware = require('./middlewares/auth');
app.use('/todos', authMiddleware, todoRoutes);

// CORS 추가
const cors = require('cors');
app.use(cors());

// Rate Limiting 추가
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

### 라우터 모듈화

```javascript
// 기능별 분리
app.use('/todos', todoRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
```

---

## 🧪 테스트 용이성

### Supertest 사용

```javascript
const request = require('supertest');
const app = require('./app');

describe('POST /todos', () => {
  it('should create a todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Test' })
      .expect(201);

    expect(res.body.data.title).toBe('Test');
  });
});
```

---

## 📈 성능

- Express는 추상화 레이어가 있어 순수 Node.js보다 약간 느림
- 실제 차이는 미미함 (대부분의 애플리케이션에서 무시 가능)
- 개발 생산성 향상이 성능 차이보다 더 가치 있음

---

**"Express는 Node.js의 복잡함을 숨기고, 개발자가 비즈니스 로직에 집중하게 한다"**
