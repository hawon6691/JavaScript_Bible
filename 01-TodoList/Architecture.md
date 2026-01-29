# Architecture (아키텍처 설계)

## 🏗️ 아키텍처 개요

TodoList API의 전체 구조와 설계 원칙을 정의합니다.

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
│                    HTTP Server Layer                     │
│                  (요청 수신 및 응답 전송)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Routing Layer                         │
│                  (URL과 Handler 매핑)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Middleware Layer                        │
│         (JSON 파싱, 로깅, 에러 처리 등)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   Controller Layer                       │
│           (요청 처리, 검증, 응답 생성)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│              (비즈니스 로직 처리)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Repository Layer                        │
│              (데이터 접근 및 저장)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Storage                          │
│           (메모리/파일/데이터베이스)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 디렉토리 구조 (Vanilla-Right)

```
Vanilla-Right/
├── server.js                 # 서버 진입점
├── config/
│   └── config.js            # 설정 관리
├── routes/
│   └── todoRoutes.js        # 라우팅 정의
├── controllers/
│   └── todoController.js    # 요청 처리
├── services/
│   └── todoService.js       # 비즈니스 로직
├── repositories/
│   └── todoRepository.js    # 데이터 접근
├── models/
│   └── Todo.js              # Todo 모델 정의
├── middlewares/
│   ├── jsonParser.js        # JSON 파싱
│   ├── logger.js            # 로깅
│   └── errorHandler.js      # 에러 처리
├── utils/
│   ├── validator.js         # 검증 유틸리티
│   ├── response.js          # 응답 헬퍼
│   └── uuid.js              # UUID 생성
├── data/
│   └── todos.json           # 데이터 저장 (파일 방식)
├── package.json
└── README.md
```

---

## 🎯 계층별 책임 (Layered Architecture)

### 1. Server Layer (서버 계층)
**책임**: HTTP 서버 생성 및 관리
```javascript
// server.js
const http = require('http');
const router = require('./routes/todoRoutes');

const server = http.createServer(router);
server.listen(3000);
```

**역할**:
- ✅ HTTP 서버 생성
- ✅ 포트 바인딩
- ✅ 서버 시작/종료 관리

---

### 2. Routing Layer (라우팅 계층)
**책임**: URL 패턴과 Handler 매핑

```javascript
// routes/todoRoutes.js
function router(req, res) {
  const { method, url } = req;
  
  // POST /todos
  if (method === 'POST' && url === '/todos') {
    return todoController.createTodo(req, res);
  }
  
  // GET /todos
  if (method === 'GET' && url === '/todos') {
    return todoController.getTodos(req, res);
  }
  
  // ... 기타 라우트
}
```

**역할**:
- ✅ URL 패턴 매칭
- ✅ HTTP 메서드 확인
- ✅ 적절한 Controller로 라우팅
- ✅ 404 처리

---

### 3. Middleware Layer (미들웨어 계층)
**책임**: 요청 전처리 및 공통 기능

```javascript
// middlewares/jsonParser.js
function jsonParser(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      req.body = JSON.parse(body);
      callback(null);
    } catch (error) {
      callback(error);
    }
  });
}
```

**역할**:
- ✅ JSON 파싱
- ✅ 요청 로깅
- ✅ 에러 처리
- ✅ CORS 처리 (필요시)

---

### 4. Controller Layer (컨트롤러 계층)
**책임**: HTTP 요청/응답 처리

```javascript
// controllers/todoController.js
const todoService = require('../services/todoService');
const validator = require('../utils/validator');
const response = require('../utils/response');

async function createTodo(req, res) {
  try {
    // 1. 입력값 검증
    const validationError = validator.validateTodo(req.body);
    if (validationError) {
      return response.badRequest(res, validationError);
    }
    
    // 2. 서비스 호출
    const todo = await todoService.createTodo(req.body);
    
    // 3. 응답 전송
    return response.created(res, todo);
  } catch (error) {
    return response.serverError(res, error);
  }
}
```

**역할**:
- ✅ 요청 데이터 추출
- ✅ 입력값 검증
- ✅ Service 계층 호출
- ✅ 응답 형식 생성
- ✅ 상태 코드 설정

**하지 말아야 할 것**:
- ❌ 비즈니스 로직 포함
- ❌ 데이터베이스 직접 접근
- ❌ 복잡한 연산

---

### 5. Service Layer (서비스 계층)
**책임**: 비즈니스 로직 처리

```javascript
// services/todoService.js
const todoRepository = require('../repositories/todoRepository');
const { generateUUID } = require('../utils/uuid');

async function createTodo(data) {
  // 1. Todo 객체 생성
  const todo = {
    id: generateUUID(),
    title: data.title,
    description: data.description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 2. Repository를 통해 저장
  await todoRepository.save(todo);
  
  // 3. 저장된 Todo 반환
  return todo;
}
```

**역할**:
- ✅ 비즈니스 로직 구현
- ✅ 데이터 변환
- ✅ Repository 계층 호출
- ✅ 복잡한 연산 처리

**하지 말아야 할 것**:
- ❌ HTTP 요청/응답 처리
- ❌ 데이터 저장소 직접 접근

---

### 6. Repository Layer (리포지토리 계층)
**책임**: 데이터 접근 및 저장

```javascript
// repositories/todoRepository.js
let todos = []; // 메모리 저장소

async function save(todo) {
  todos.push(todo);
  return todo;
}

async function findAll() {
  return [...todos].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

async function findById(id) {
  return todos.find(todo => todo.id === id);
}

async function update(id, data) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return null;
  
  todos[index] = { ...todos[index], ...data };
  return todos[index];
}

async function remove(id) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return null;
  
  const [removed] = todos.splice(index, 1);
  return removed;
}
```

**역할**:
- ✅ CRUD 연산 구현
- ✅ 데이터 저장소 추상화
- ✅ 쿼리 로직 처리

**장점**:
- ✅ 저장소 변경 시 Repository만 수정
- ✅ 테스트 용이 (Mock 가능)
- ✅ 비즈니스 로직과 데이터 접근 분리

---

## 🎨 설계 패턴

### 1. Layered Architecture (계층화 아키텍처)
```
Controller → Service → Repository → Data
```

**장점**:
- ✅ 관심사의 분리 (Separation of Concerns)
- ✅ 테스트 용이성
- ✅ 유지보수 편리
- ✅ 확장성

**단점**:
- ⚠️ 간단한 앱에는 과도할 수 있음
- ⚠️ 레이어 간 데이터 전달 오버헤드

---

### 2. Repository Pattern (리포지토리 패턴)
**목적**: 데이터 접근 로직 추상화

**Before (잘못된 방식)**:
```javascript
// Service에서 직접 데이터 접근
async function createTodo(data) {
  todos.push(data); // ❌ 직접 접근
}
```

**After (올바른 방식)**:
```javascript
// Repository를 통한 간접 접근
async function createTodo(data) {
  await todoRepository.save(data); // ✅ 추상화
}
```

**장점**:
- ✅ 저장소 교체 용이 (메모리 → 파일 → DB)
- ✅ 테스트 시 Mock 가능
- ✅ 데이터 접근 로직 중앙화

---

### 3. Dependency Injection (의존성 주입)
**목적**: 모듈 간 결합도 감소

```javascript
// Service가 Repository에 의존
const todoRepository = require('../repositories/todoRepository');

// 향후 개선: 생성자 주입
class TodoService {
  constructor(repository) {
    this.repository = repository;
  }
  
  async createTodo(data) {
    return this.repository.save(data);
  }
}
```

---

## 🔄 요청 흐름 (Request Flow)

### 예시: POST /todos 요청

```
1. Client
   ↓ HTTP POST /todos
   
2. Server (server.js)
   ↓ 요청 수신
   
3. Router (todoRoutes.js)
   ↓ URL/메서드 매칭 → todoController.createTodo 호출
   
4. Middleware (jsonParser.js)
   ↓ JSON 파싱 → req.body 생성
   
5. Controller (todoController.js)
   ↓ 입력 검증 → todoService.createTodo 호출
   
6. Service (todoService.js)
   ↓ 비즈니스 로직 → Todo 객체 생성 → todoRepository.save 호출
   
7. Repository (todoRepository.js)
   ↓ 데이터 저장 → 메모리 배열에 추가
   
8. Service
   ↓ 저장된 Todo 반환
   
9. Controller
   ↓ 응답 생성 (201 Created)
   
10. Client
    ← HTTP 201 + JSON 응답
```

**소요 시간**: ~10-50ms (메모리 기준)

---

## 🛡️ 에러 처리 전략

### 계층별 에러 처리

```
Controller Layer:
  ↓ try-catch로 모든 에러 포착
  ↓ 적절한 HTTP 상태 코드 선택
  
Service Layer:
  ↓ 비즈니스 로직 에러 throw
  ↓ 검증 실패 시 명확한 에러 메시지
  
Repository Layer:
  ↓ 데이터 접근 에러 throw
  ↓ Not Found, Duplicate 등
  
Error Handler:
  ↓ 모든 에러 로깅
  ↓ 클라이언트에 안전한 에러 메시지 전송
```

**에러 타입**:
1. **Validation Error**: 400 Bad Request
2. **Not Found Error**: 404 Not Found
3. **Internal Error**: 500 Internal Server Error

---

## 📊 데이터 흐름 (Data Flow)

```
┌──────────────┐
│ Client       │
│ { title: "…" }│
└──────┬───────┘
       │ HTTP Request
       ↓
┌──────────────┐
│ Controller   │
│ req.body     │
└──────┬───────┘
       │ DTO
       ↓
┌──────────────┐
│ Service      │
│ Todo Object  │
└──────┬───────┘
       │ Entity
       ↓
┌──────────────┐
│ Repository   │
│ Save to DB   │
└──────┬───────┘
       │ Saved Entity
       ↓
┌──────────────┐
│ Service      │
│ Return Todo  │
└──────┬───────┘
       │ DTO
       ↓
┌──────────────┐
│ Controller   │
│ JSON Response│
└──────┬───────┘
       │ HTTP Response
       ↓
┌──────────────┐
│ Client       │
│ { success: …}│
└──────────────┘
```

---

## 🔐 보안 고려사항

### 1. 입력 검증
```javascript
// 모든 입력값 검증
function validateTodo(data) {
  if (!data.title || data.title.trim().length === 0) {
    return 'Title is required';
  }
  
  if (data.title.length > 100) {
    return 'Title must be 100 characters or less';
  }
  
  // XSS 방지를 위한 HTML 이스케이프
  // (실제 구현에서는 라이브러리 사용 권장)
}
```

### 2. 에러 정보 노출 방지
```javascript
// ❌ 잘못된 방식
catch (error) {
  res.end(error.stack); // 스택 트레이스 노출
}

// ✅ 올바른 방식
catch (error) {
  console.error(error); // 서버에만 로깅
  res.end('Internal Server Error'); // 일반적인 메시지
}
```

---

## 🚀 확장성 고려사항

### 수평적 확장 (Horizontal Scaling)
```
Load Balancer
    │
    ├─→ Server 1 (Port 3000)
    ├─→ Server 2 (Port 3001)
    └─→ Server 3 (Port 3002)
         │
         └─→ Shared Database
```

### 수직적 확장 (Vertical Scaling)
- 메모리 증설
- CPU 업그레이드
- 캐싱 적용

---

## 📈 성능 최적화

### 1. 메모리 저장소
- 속도: ⚡⚡⚡⚡⚡ (매우 빠름)
- 영속성: ❌ (서버 재시작 시 손실)

### 2. 파일 저장소
- 속도: ⚡⚡⚡ (보통)
- 영속성: ✅ (파일로 저장)

### 3. 데이터베이스
- 속도: ⚡⚡⚡⚡ (빠름)
- 영속성: ✅ (영구 저장)
- 확장성: ✅ (대용량 지원)

---

## 🧪 테스트 전략

### 단위 테스트 (Unit Test)
```javascript
// Service 테스트
describe('TodoService', () => {
  it('should create todo with correct structure', () => {
    const result = todoService.createTodo({ title: 'Test' });
    expect(result).toHaveProperty('id');
    expect(result.completed).toBe(false);
  });
});
```

### 통합 테스트 (Integration Test)
```javascript
// API 테스트
describe('POST /todos', () => {
  it('should return 201 and created todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ title: 'Test' })
      .expect(201);
  });
});
```

---

**"좋은 아키텍처는 변화에 유연하고 테스트하기 쉽다"**