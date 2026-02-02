# Architecture.md 프레임워크별 작성 가이드

## 📋 개요

Architecture.md는 **각 프레임워크 폴더에 별도로 존재**해야 합니다.

왜냐하면 각 프레임워크마다 **구조, 파일 배치, 패턴이 다르기 때문**입니다.

---

## 📁 파일 위치

```
01-TodoList/
├── 00-Design/
│   ├── Requirements.md           # 공통
│   ├── ERD.md                    # 공통
│   ├── API-Specification.md      # 공통
│   └── README.md                 # 공통
│
├── Vanilla/
│   └── Architecture.md           # ⭐ Vanilla 전용
│
├── Express/
│   └── Architecture.md           # ⭐ Express 전용
│
├── NestJS/
│   └── Architecture.md           # ⭐ NestJS 전용
│
└── Fastify/
    └── Architecture.md           # ⭐ Fastify 전용
```

---

## 🎯 공통 내용

모든 Architecture.md에 포함되어야 할 내용:

1. **전체 아키텍처 다이어그램**
   - Client → Server → Router → Controller → Service → Repository → Data

2. **디렉토리 구조**
   - 프레임워크별로 다름!

3. **계층별 책임**
   - Controller: HTTP 처리
   - Service: 비즈니스 로직
   - Repository: 데이터 접근

4. **설계 패턴**
   - Repository Pattern
   - Dependency Injection (프레임워크에 따라 다름)

5. **요청 흐름 예시**
   - POST /todos 요청이 어떻게 처리되는지

6. **에러 처리 전략**

---

## 📊 프레임워크별 차이점

### 1. Vanilla Node.js

**특징:**
- ✅ 외부 의존성 없음
- ✅ HTTP 서버 직접 구현
- ✅ 라우팅 수동 구현
- ✅ 미들웨어 직접 작성

**디렉토리 구조:**
```
Vanilla/
├── server.js                 # HTTP 서버 + 진입점
├── routes/
│   └── todoRoutes.js        # 수동 라우팅 (if-else, switch)
├── controllers/
├── services/
├── repositories/
├── middlewares/              # 직접 구현
│   ├── jsonParser.js
│   ├── logger.js
│   └── errorHandler.js
└── utils/
```

**핵심 코드:**
```javascript
// server.js
const http = require('http');
const router = require('./routes/todoRoutes');

const server = http.createServer(router);
server.listen(3000);
```

**라우팅:**
```javascript
// routes/todoRoutes.js
function router(req, res) {
  if (method === 'POST' && url === '/todos') {
    await todoController.createTodo(req, res);
  } else if (method === 'GET' && url === '/todos') {
    await todoController.getTodos(req, res);
  }
  // ...
}
```

---

### 2. Express

**특징:**
- ✅ 미들웨어 체인
- ✅ 라우터 자동화
- ✅ req.body 자동 파싱
- ✅ 풍부한 생태계

**디렉토리 구조:**
```
Express/
├── app.js                    # Express 앱 생성
├── server.js                 # 서버 시작 (선택)
├── routes/
│   └── todos.js             # Express Router 사용
├── controllers/
│   └── todoController.js
├── services/
├── repositories/
├── middlewares/              # Express 미들웨어
│   ├── errorHandler.js
│   └── logger.js
└── models/
```

**핵심 코드:**
```javascript
// app.js
const express = require('express');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(express.json());      // 자동 JSON 파싱
app.use('/todos', todoRoutes); // 라우터 연결

module.exports = app;
```

**라우팅:**
```javascript
// routes/todos.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodoById);

module.exports = router;
```

---

### 3. NestJS

**특징:**
- ✅ TypeScript 기반
- ✅ 데코레이터 패턴
- ✅ 의존성 주입 (DI)
- ✅ 모듈 시스템
- ✅ 엔터프라이즈급 구조

**디렉토리 구조:**
```
NestJS/
├── src/
│   ├── main.ts               # 진입점
│   ├── app.module.ts         # 루트 모듈
│   └── todos/
│       ├── todos.module.ts   # Todo 모듈
│       ├── todos.controller.ts
│       ├── todos.service.ts
│       ├── todos.repository.ts
│       ├── dto/
│       │   ├── create-todo.dto.ts
│       │   └── update-todo.dto.ts
│       └── entities/
│           └── todo.entity.ts
├── test/
├── nest-cli.json
└── tsconfig.json
```

**핵심 코드:**
```typescript
// todos.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }
}
```

**모듈:**
```typescript
// todos.module.ts
import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
```

---

### 4. Fastify

**특징:**
- ✅ 매우 빠른 성능
- ✅ 스키마 기반 검증
- ✅ 플러그인 시스템
- ✅ TypeScript 지원

**디렉토리 구조:**
```
Fastify/
├── server.js                 # Fastify 서버
├── routes/
│   └── todos.js             # Fastify 라우트
├── controllers/
├── services/
├── repositories/
├── schemas/                  # JSON Schema
│   └── todoSchema.js
└── plugins/
    ├── database.js
    └── cors.js
```

**핵심 코드:**
```javascript
// server.js
const fastify = require('fastify')({ logger: true });
const todoRoutes = require('./routes/todos');

fastify.register(todoRoutes, { prefix: '/todos' });

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});
```

**라우팅:**
```javascript
// routes/todos.js
async function todoRoutes(fastify, options) {
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 }
        }
      }
    },
    handler: todoController.createTodo
  });

  fastify.get('/', todoController.getTodos);
}

module.exports = todoRoutes;
```

---

## 📋 Architecture.md 템플릿

각 프레임워크의 Architecture.md는 다음 섹션을 포함해야 함:

### 필수 섹션

1. **아키텍처 개요**
   - 전체 계층 다이어그램

2. **디렉토리 구조**
   - 프레임워크 특화된 구조

3. **계층별 책임**
   - Server/Router/Controller/Service/Repository

4. **핵심 코드 예시**
   - 서버 생성
   - 라우팅
   - Controller 예시

5. **설계 패턴**
   - 사용된 패턴 설명

6. **요청 흐름**
   - POST /todos 예시

7. **에러 처리**
   - 프레임워크별 에러 처리 방식

---

## ✅ 작성 체크리스트

### Vanilla/Architecture.md
- [ ] HTTP 서버 직접 생성 설명
- [ ] 수동 라우팅 방식
- [ ] 미들웨어 직접 구현
- [ ] 파일 저장소 구현

### Express/Architecture.md
- [ ] Express 앱 생성 방식
- [ ] Router 사용법
- [ ] 미들웨어 체인
- [ ] 에러 핸들러

### NestJS/Architecture.md
- [ ] 모듈 시스템
- [ ] 데코레이터 패턴
- [ ] 의존성 주입
- [ ] DTO 사용

### Fastify/Architecture.md
- [ ] Fastify 서버 생성
- [ ] 플러그인 시스템
- [ ] 스키마 검증
- [ ] 성능 최적화

---

## 🎯 핵심 메시지

**같은 목표, 다른 접근법**

- ✅ 모든 버전이 같은 API 명세 구현
- ✅ 계층 분리 원칙은 동일
- ✅ 구현 방식만 프레임워크에 최적화

---

**다음: 각 프레임워크별 Architecture.md 실제 작성 예시를 제공하겠습니다!**