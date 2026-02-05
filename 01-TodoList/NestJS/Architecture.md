# Architecture (NestJS 아키텍처)

## 📋 개요

NestJS 버전의 TodoList API는 **엔터프라이즈급 아키텍처**를 구현합니다.

**핵심 특징:**
- ✅ TypeScript 기반 타입 안정성
- ✅ 데코레이터 패턴으로 간결한 코드
- ✅ 의존성 주입(DI)으로 높은 테스트 용이성
- ✅ 모듈 시스템으로 명확한 구조 분리
- ✅ 계층화 아키텍처 (Controller → Service → Repository)

---

## 🏗️ 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│                    (HTTP Requests)                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Server                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │               Middleware Layer                        │ │
│  │  - CORS                                               │ │
│  │  - ValidationPipe (자동 검증)                         │ │
│  │  - HttpExceptionFilter (에러 처리)                    │ │
│  └───────────────────────────────────────────────────────┘ │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │            Controller Layer (HTTP 계층)              │ │
│  │  @Controller('todos')                                 │ │
│  │  - TodosController                                    │ │
│  │    - HTTP 요청/응답 처리                              │ │
│  │    - 라우팅 (@Get, @Post, @Put, @Patch, @Delete)     │ │
│  │    - DTO 검증                                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │          Service Layer (비즈니스 로직 계층)          │ │
│  │  @Injectable()                                        │ │
│  │  - TodosService                                       │ │
│  │    - 비즈니스 로직 처리                               │ │
│  │    - 입력값 추가 검증                                 │ │
│  │    - 에러 처리 및 예외 발생                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │        Repository Layer (데이터 접근 계층)           │ │
│  │  @Injectable()                                        │ │
│  │  - TodosRepository                                    │ │
│  │    - CRUD 연산                                        │ │
│  │    - 데이터 저장소 추상화                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Data Storage (저장소)                   │ │
│  │  - 메모리 (현재)                                      │ │
│  │  - 파일 시스템 (향후)                                 │ │
│  │  - 데이터베이스 (향후)                                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 디렉토리 구조

```
NestJS/
├── package.json              # 의존성 및 스크립트
├── tsconfig.json             # TypeScript 설정
├── nest-cli.json             # NestJS CLI 설정
├── .gitignore
│
└── src/
    ├── main.ts               # 애플리케이션 진입점 (서버 시작)
    ├── app.module.ts         # 루트 모듈 (전체 앱 구성)
    │
    ├── common/               # 공통 기능
    │   └── filters/
    │       └── http-exception.filter.ts  # 전역 예외 필터
    │
    └── todos/                # Todo 기능 모듈
        ├── todos.module.ts         # Todo 모듈 (컴포넌트 구성)
        ├── todos.controller.ts     # HTTP 요청 처리
        ├── todos.service.ts        # 비즈니스 로직
        ├── todos.repository.ts     # 데이터 접근
        │
        ├── dto/                    # Data Transfer Objects
        │   ├── create-todo.dto.ts  # 생성 DTO
        │   └── update-todo.dto.ts  # 수정 DTO
        │
        └── entities/               # 엔티티 (데이터 모델)
            └── todo.entity.ts      # Todo 엔티티
```

---

## 🎯 계층별 책임

### 1. Controller Layer (HTTP 계층)

**파일:** `todos.controller.ts`

**역할:**
- HTTP 요청을 받아 적절한 Service 메서드 호출
- 응답 형식 구성 (success, data, message)
- HTTP 상태 코드 설정

**데코레이터 사용:**
```typescript
@Controller('todos')      // 라우트 경로 정의
@Get()                    // HTTP GET
@Post()                   // HTTP POST
@Put(':id')               // HTTP PUT with param
@Patch(':id')             // HTTP PATCH
@Delete(':id')            // HTTP DELETE
@Body()                   // Request Body
@Param('id')              // URL Parameter
@HttpCode()               // 상태 코드 설정
```

**예시:**
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
create(@Body() createTodoDto: CreateTodoDto) {
  const todo = this.todosService.create(createTodoDto);
  return {
    success: true,
    data: todo,
    message: 'Todo created successfully',
  };
}
```

---

### 2. Service Layer (비즈니스 로직 계층)

**파일:** `todos.service.ts`

**역할:**
- 비즈니스 로직 처리
- 입력값 추가 검증 (공백 체크 등)
- Repository 호출
- 에러 처리 및 예외 발생 (NotFoundException, BadRequestException)

**의존성 주입:**
```typescript
@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}
  // ↑ NestJS가 자동으로 TodosRepository 인스턴스 주입
}
```

**예시:**
```typescript
create(createTodoDto: CreateTodoDto): Todo {
  const { title, description = '' } = createTodoDto;

  // 비즈니스 로직: 공백 검증
  if (title.trim().length === 0) {
    throw new BadRequestException('Title cannot be empty');
  }

  return this.todosRepository.create(title.trim(), description.trim());
}
```

---

### 3. Repository Layer (데이터 접근 계층)

**파일:** `todos.repository.ts`

**역할:**
- 순수한 CRUD 연산만 수행
- 데이터 저장소(메모리, 파일, DB)와의 상호작용
- 데이터 저장소 구현 세부사항 숨김

**예시:**
```typescript
@Injectable()
export class TodosRepository {
  private todos: Todo[] = [];

  findAll(): Todo[] {
    return this.todos.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  create(title: string, description: string): Todo {
    const newTodo = new Todo({
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.todos.push(newTodo);
    return newTodo;
  }
}
```

---

## 🔧 핵심 설계 패턴

### 1. 모듈 패턴 (Module Pattern)

NestJS의 핵심 개념. 관련된 기능을 하나의 모듈로 묶습니다.

```typescript
@Module({
  controllers: [TodosController],   // HTTP 처리
  providers: [TodosService, TodosRepository],  // DI 가능한 클래스
  exports: [TodosService],          // 다른 모듈에서 사용 가능
})
export class TodosModule {}
```

**장점:**
- 관심사의 분리 (Separation of Concerns)
- 재사용성 향상
- 테스트 용이성

---

### 2. 의존성 주입 (Dependency Injection)

NestJS가 자동으로 의존성을 관리하고 주입합니다.

```typescript
// Service에서 Repository 주입받기
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}
  // ↑ NestJS가 자동으로 TodosRepository 인스턴스를 생성하여 주입
}

// Controller에서 Service 주입받기
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  // ↑ NestJS가 자동으로 TodosService 인스턴스를 생성하여 주입
}
```

**장점:**
- 테스트 시 Mock 객체로 쉽게 교체 가능
- 결합도 감소
- 코드 재사용성 향상

---

### 3. Repository Pattern

데이터 접근 로직을 추상화하여 저장소 교체를 쉽게 합니다.

```typescript
// 메모리 → 파일 시스템으로 변경 시
// Repository 내부만 수정하면 됨
// Service와 Controller는 변경 불필요

class TodosRepository {
  // Before: 메모리
  private todos: Todo[] = [];

  // After: 파일 시스템
  private loadFromFile() { ... }
  private saveToFile() { ... }
}
```

---

### 4. DTO Pattern (Data Transfer Object)

클라이언트와 서버 간 데이터 전송 객체를 정의합니다.

```typescript
export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(100, { message: 'Title must be 100 characters or less' })
  title: string;

  @IsOptional()
  @MaxLength(500)
  description?: string;
}
```

**장점:**
- 자동 검증 (class-validator)
- 타입 안정성
- API 문서화에 활용

---

## 🔄 요청 흐름 예시

### POST /todos 요청 처리 과정

```
1. Client
   ↓
   POST /todos
   Body: { "title": "NestJS 학습", "description": "공식 문서 읽기" }

2. NestJS Middleware
   ↓
   - ValidationPipe: DTO 검증 (title 길이, 타입 등)
   - CORS 처리

3. TodosController.create()
   ↓
   @Post()
   create(@Body() createTodoDto: CreateTodoDto) {
     const todo = this.todosService.create(createTodoDto);
     return { success: true, data: todo, message: '...' };
   }

4. TodosService.create()
   ↓
   create(createTodoDto: CreateTodoDto): Todo {
     // 비즈니스 로직: 공백 검증
     if (title.trim().length === 0) {
       throw new BadRequestException('Title cannot be empty');
     }
     return this.todosRepository.create(title, description);
   }

5. TodosRepository.create()
   ↓
   create(title: string, description: string): Todo {
     const newTodo = new Todo({
       id: uuidv4(),
       title,
       description,
       completed: false,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
     });
     this.todos.push(newTodo);
     return newTodo;
   }

6. Response
   ↓
   {
     "success": true,
     "data": {
       "id": "uuid-...",
       "title": "NestJS 학습",
       "description": "공식 문서 읽기",
       "completed": false,
       "createdAt": "2024-01-29T10:00:00.000Z",
       "updatedAt": "2024-01-29T10:00:00.000Z"
     },
     "message": "Todo created successfully"
   }
```

---

## ⚠️ 에러 처리 전략

### 1. ValidationPipe (입력 검증)

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // DTO에 없는 속성 제거
    forbidNonWhitelisted: true,   // DTO에 없는 속성 있으면 에러
    transform: true,              // 타입 자동 변환
  }),
);
```

### 2. HttpExceptionFilter (예외 처리)

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 모든 HTTP 예외를 일관된 형식으로 변환
    return {
      success: false,
      error: {
        code: 'ERROR_CODE',
        message: 'Error message',
      },
    };
  }
}
```

### 3. Service에서 예외 발생

```typescript
// 404 Not Found
throw new NotFoundException(`Todo not found with id: ${id}`);

// 400 Bad Request
throw new BadRequestException('Title cannot be empty');
```

---

## 🎨 NestJS만의 특징

### 1. 데코레이터 기반 라우팅

```typescript
@Controller('todos')    // 기본 경로: /todos
export class TodosController {
  @Get()                // GET /todos
  @Get(':id')           // GET /todos/:id
  @Post()               // POST /todos
  @Put(':id')           // PUT /todos/:id
  @Patch(':id/toggle')  // PATCH /todos/:id/toggle
}
```

### 2. 자동 의존성 주입

```typescript
// 수동 인스턴스 생성 불필요
// NestJS가 자동으로 관리
constructor(private readonly todosService: TodosService) {}
```

### 3. 모듈 시스템

```typescript
@Module({
  imports: [TodosModule],        // 다른 모듈 가져오기
  controllers: [AppController],  // 컨트롤러 등록
  providers: [AppService],       // 프로바이더 등록
})
```

### 4. TypeScript 완전 지원

```typescript
// 컴파일 타임에 타입 체크
const todo: Todo = this.todosService.findOne(id);
```

---

## 📊 Vanilla vs Express vs NestJS 비교

| 항목 | Vanilla | Express | NestJS |
|------|---------|---------|--------|
| 라우팅 | 수동 (if-else) | Router 사용 | 데코레이터 |
| 의존성 주입 | 수동 | 수동 | 자동 (DI 컨테이너) |
| 검증 | 수동 구현 | 미들웨어 | class-validator |
| 구조화 | 수동 | 중간 | 강력 (모듈 시스템) |
| 타입 안정성 | 없음 | 없음 | 강력 (TypeScript) |
| 코드량 | 많음 | 중간 | 중간 (간결) |
| 학습 곡선 | 낮음 | 중간 | 높음 |

---

## 🔐 보안 고려사항

### 1. 입력 검증

```typescript
// DTO에서 자동 검증
@IsNotEmpty()
@MaxLength(100)
title: string;
```

### 2. XSS 방지

```typescript
// trim()으로 공백 제거
title.trim()
```

### 3. 에러 정보 노출 방지

```typescript
// HttpExceptionFilter에서 민감한 정보 제거
// 프로덕션에서는 상세 에러 스택 숨김
```

---

## 🚀 확장 계획

### Phase 2: 데이터베이스 연동

```typescript
@Injectable()
export class TodosRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepo.find({ order: { createdAt: 'DESC' } });
  }
}
```

### Phase 3: 인증 & 인가

```typescript
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  // JWT 토큰 검증 후에만 접근 가능
}
```

---

## 💡 핵심 메시지

> **"NestJS는 TypeScript와 데코레이터를 활용하여 엔터프라이즈급 아키텍처를 간결하게 구현합니다"**

- ✅ 강력한 타입 안정성 (TypeScript)
- ✅ 자동 의존성 주입 (DI Container)
- ✅ 모듈 시스템으로 명확한 구조
- ✅ 데코레이터로 간결한 코드
- ✅ 대규모 프로젝트에 최적화

---

**"설계는 공통, 구현은 NestJS답게"** 🚀
