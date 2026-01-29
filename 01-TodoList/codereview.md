# TodoList Vanilla-Right 코드 리뷰

## 📊 전체 평가

**전체 점수: 85/100** ⭐⭐⭐⭐

### ✅ 잘된 점 (Strengths)
1. **계층 분리가 명확** - Controller → Service → Repository 구조 완벽
2. **주석 100%** - 모든 함수에 What-Why-How 주석 완벽
3. **코드 가독성 우수** - 일관된 네이밍, 깔끔한 구조
4. **에러 처리** - 대부분의 케이스 커버
5. **입력 검증** - validator 모듈로 체계적으로 관리

### ❌ 개선 필요 (Critical Issues)

---

## 🔴 Critical Issues (반드시 수정)

### 1. **MySQL 사용 - Vanilla 버전 원칙 위반** 
**심각도: 🔴 매우 높음**

```javascript
// ❌ 현재: MySQL 사용
const mysql = require('mysql2/promise');
const pool = mysql.createPool({...});
```

**문제점:**
- Vanilla 버전은 **순수 Node.js**만 사용해야 함
- 외부 라이브러리(mysql2, dotenv)를 사용하면 Vanilla가 아님
- 설계 문서에서는 메모리/파일 저장소를 명시

**해결 방법:**

#### 옵션 1: 메모리 저장소 (추천 - 가장 간단)
```javascript
// repositories/todoRepository.js
let todos = []; // 메모리 배열

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
  return todos.find(todo => todo.id === id) || null;
}

async function update(id, updatedTodo) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return null;
  
  todos[index] = { ...todos[index], ...updatedTodo };
  return todos[index];
}

async function remove(id) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return null;
  
  const [removed] = todos.splice(index, 1);
  return removed;
}
```

#### 옵션 2: 파일 저장소 (영속성 필요 시)
```javascript
// repositories/todoRepository.js
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/todos.json');

async function loadTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
}

async function save(todo) {
  const todos = await loadTodos();
  todos.push(todo);
  await saveTodos(todos);
  return todo;
}

async function findAll() {
  const todos = await loadTodos();
  return todos.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}
```

**수정 범위:**
- `config/database.js` → 삭제
- `repositories/todoRepository.js` → 전체 재작성
- `server.js` → DB 초기화 로직 제거
- `package.json` → mysql2 의존성 제거

---

### 2. **Graceful Shutdown 불완전**
**심각도: 🟠 높음**

```javascript
// ❌ 현재 코드
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

**문제점:**
- DB connection pool을 닫지 않음
- 메모리 저장소로 변경 시에도 파일 저장 필요

**해결 방법:**
```javascript
// ✅ 개선된 코드
process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  
  server.close(async () => {
    console.log('Server closed');
    
    // 메모리 저장소인 경우: 파일로 백업
    try {
      await todoRepository.backup(); // backup 함수 추가
      console.log('Data backed up');
    } catch (error) {
      console.error('Backup failed:', error.message);
    }
    
    process.exit(0);
  });
  
  // 10초 타임아웃
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});
```

---

### 3. **Controller에서 try-catch 누락**
**심각도: 🟠 높음**

```javascript
// ❌ 현재 코드
async function createTodo(req, res) {
  const validationError = validateCreateTodo(req.body);
  if (validationError) {
    return response.badRequest(res, validationError);
  }
  
  const todo = await todoService.create(req.body); // 에러 발생 가능
  return response.created(res, todo, 'Todo created successfully');
}
```

**문제점:**
- Service나 Repository에서 에러 발생 시 처리 안 됨
- 현재는 Router에서만 catch하는데, Controller에서도 명시적 처리 필요

**해결 방법:**
```javascript
// ✅ 개선된 코드
async function createTodo(req, res) {
  try {
    // 1. 입력값 검증
    const validationError = validateCreateTodo(req.body);
    if (validationError) {
      return response.badRequest(res, validationError);
    }
    
    // 2. 서비스 호출
    const todo = await todoService.create(req.body);
    
    // 3. 응답 전송
    return response.created(res, todo, 'Todo created successfully');
  } catch (error) {
    console.error('Error in createTodo:', error);
    return response.serverError(res, 'Failed to create todo');
  }
}
```

**적용 대상:**
- `createTodo`
- `getTodos`
- `getTodoById`
- `updateTodo`
- `patchTodo`
- `deleteTodo`
- `toggleTodo`

---

## 🟡 Medium Issues (개선 권장)

### 4. **UUID 검증 누락**
**심각도: 🟡 중간**

```javascript
// ❌ 현재: ID 검증 없이 바로 사용
async function getTodoById(req, res) {
  const { id } = req.params;
  const todo = await todoService.getById(id); // 잘못된 UUID도 통과
  ...
}
```

**해결 방법:**
```javascript
// ✅ Router에서 검증
const { isValidUUID } = require('../utils/validator');

function extractTodoId(url) {
  const match = url.match(/^\/todos\/([^\/]+)$/);
  if (!match) return null;
  
  const id = match[1];
  return isValidUUID(id) ? id : null;
}
```

---

### 5. **CORS 설정 하드코딩**
**심각도: 🟡 중간**

```javascript
// ❌ 현재: 라우터에 하드코딩
res.setHeader('Access-Control-Allow-Origin', '*');
```

**해결 방법:**
```javascript
// config/config.js에 추가
cors: {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  headers: 'Content-Type'
}

// routes/todoRoutes.js
const { cors } = require('../config/config');
res.setHeader('Access-Control-Allow-Origin', cors.origin);
```

---

### 6. **unhandledRejection 처리 불완전**
**심각도: 🟡 중간**

```javascript
// ❌ 현재: 로그만 찍고 종료 안 함
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // process.exit 없음 → 좀비 프로세스 가능
});
```

**해결 방법:**
```javascript
// ✅ 개선
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // 추가
});
```

---

### 7. **환경변수 의존성**
**심각도: 🟡 중간**

```javascript
// ❌ 현재: dotenv 사용 (외부 라이브러리)
require('dotenv').config();
```

**Vanilla 버전에서는:**
- dotenv 사용 금지
- 환경변수를 직접 읽거나 config.js에 하드코딩

**해결 방법:**
```javascript
// config/config.js
module.exports = {
  env: process.env.NODE_ENV || 'development',
  server: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000
  }
};

// package.json
{
  "scripts": {
    "start": "NODE_ENV=production PORT=3000 node server.js"
  }
}
```

---

## 🟢 Minor Issues (옵션)

### 8. **로깅 중복 가능성**
```javascript
// routes/todoRoutes.js
logResponse(req, res.statusCode, startTime); // Router에서 로깅
```

**개선:**
- 미들웨어 패턴으로 통합
- 모든 응답을 한 곳에서 로깅

---

### 9. **Magic Numbers**
```javascript
// ❌ 하드코딩된 숫자
if (data.title.length > 100) { ... }
if (data.description.length > 500) { ... }
```

**개선:**
```javascript
// constants.js
module.exports = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
};
```

---

### 10. **Date 형식 변환 중복**
```javascript
// ❌ repository에서 반복되는 로직
createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt
```

**개선:**
```javascript
// utils/date.js
function formatDate(date) {
  return date instanceof Date ? date.toISOString() : date;
}
```

---

## 📋 수정 우선순위

### 🔴 P0 (즉시 수정)
1. **MySQL → 메모리/파일 저장소로 변경**
2. **Controller에 try-catch 추가**
3. **Graceful shutdown 개선**

### 🟠 P1 (빠른 시일 내 수정)
4. UUID 검증 추가
5. unhandledRejection 종료 처리
6. dotenv 제거

### 🟡 P2 (여유 있을 때)
7. CORS 설정 분리
8. Magic numbers 상수화
9. Date 변환 로직 통합

---

## 💡 추가 제안

### 1. 테스트 코드 작성
```javascript
// tests/todoController.test.js
describe('TodoController', () => {
  it('should create todo with valid input', async () => {
    // ...
  });
});
```

### 2. JSDoc 타입 정의
```javascript
/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {boolean} completed
 * @property {string} createdAt
 * @property {string} updatedAt
 */
```

### 3. README.md 개선
- 설치 방법
- 실행 방법
- API 사용 예시
- 아키텍처 다이어그램

---

## 📊 수정 후 예상 점수

| 항목 | 현재 | 수정 후 |
|------|------|---------|
| 아키텍처 | 90 | 95 |
| 코드 품질 | 85 | 90 |
| Vanilla 원칙 준수 | 60 | 100 |
| 에러 처리 | 80 | 95 |
| 문서화 | 95 | 95 |
| **총점** | **85** | **95** |

---

## 🎯 결론

**전반적으로 매우 잘 작성된 코드**입니다! 하지만:

1. **MySQL 사용은 Vanilla 버전 원칙에 맞지 않음** → 메모리/파일로 변경 필수
2. **에러 처리를 Controller 레벨에서도 강화** 필요
3. **외부 라이브러리(dotenv, mysql2) 제거** 필요

이 3가지만 수정하면 **완벽한 Vanilla 예제**가 됩니다! 💪
