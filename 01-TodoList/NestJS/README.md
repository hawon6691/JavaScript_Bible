# TodoList API - NestJS 버전

## 📚 개요

NestJS로 구현된 TodoList RESTful API입니다.

**JavaScript Backend Bible** 프로젝트의 일부로, 동일한 API 명세를 NestJS 프레임워크로 구현합니다.

### 주요 특징

- ✅ TypeScript 기반 타입 안정성
- ✅ 데코레이터 패턴으로 간결한 코드
- ✅ 의존성 주입(DI)으로 높은 테스트 용이성
- ✅ 모듈 시스템으로 명확한 구조 분리
- ✅ 자동 입력값 검증 (class-validator)
- ✅ 계층화 아키텍처 (Controller → Service → Repository)

---

## 🎯 학습 목표

이 프로젝트를 통해 다음을 학습합니다:

1. **NestJS 기본 개념**
   - 모듈, 컨트롤러, 서비스, 프로바이더
   - 데코레이터 패턴 (@Controller, @Get, @Post 등)
   - 의존성 주입 (Dependency Injection)

2. **TypeScript 활용**
   - 타입 정의 및 인터페이스
   - 데코레이터 메타데이터
   - 제네릭 활용

3. **엔터프라이즈 패턴**
   - DTO (Data Transfer Object)
   - Repository Pattern
   - Exception Filters

4. **자동 검증**
   - class-validator를 사용한 입력값 검증
   - ValidationPipe 활용

---

## 📋 전제 조건

- Node.js 18 이상
- npm 또는 yarn
- TypeScript 기본 지식 (권장)

---

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
cd NestJS
npm install
```

### 2. 서버 실행

#### 개발 모드 (핫 리로드)
```bash
npm run start:dev
```

#### 일반 모드
```bash
npm start
```

#### 프로덕션 모드
```bash
npm run build
npm run start:prod
```

### 3. 서버 확인

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 TodoList API Server (NestJS)                         ║
║                                                            ║
║   📡 Server running on: http://localhost:3000             ║
║   📚 Framework: NestJS (TypeScript)                       ║
║   🏗️  Architecture: Layered (Controller-Service-Repo)     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 📡 API 엔드포인트

모든 API는 `http://localhost:3000`을 기본 URL로 사용합니다.

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/todos` | Todo 생성 |
| GET | `/todos` | Todo 목록 조회 |
| GET | `/todos/:id` | 특정 Todo 조회 |
| PUT | `/todos/:id` | Todo 전체 수정 |
| PATCH | `/todos/:id` | Todo 부분 수정 |
| DELETE | `/todos/:id` | Todo 삭제 |
| PATCH | `/todos/:id/toggle` | 완료 상태 토글 |

자세한 API 명세는 [API-Specification.md](../00-Design/Api_specification.md)를 참고하세요.

---

## 🧪 사용 예시

### 1. Todo 생성

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "NestJS 공부하기",
    "description": "데코레이터와 DI 이해하기"
  }'
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "NestJS 공부하기",
    "description": "데코레이터와 DI 이해하기",
    "completed": false,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

### 2. Todo 목록 조회

```bash
curl -X GET http://localhost:3000/todos
```

### 3. 특정 Todo 조회

```bash
curl -X GET http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000
```

### 4. Todo 부분 수정

```bash
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "NestJS 마스터하기"
  }'
```

### 5. 완료 상태 토글

```bash
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000/toggle
```

### 6. Todo 삭제

```bash
curl -X DELETE http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000
```

---

## 📁 프로젝트 구조

```
NestJS/
├── package.json              # 의존성 및 스크립트
├── tsconfig.json             # TypeScript 설정
├── nest-cli.json             # NestJS CLI 설정
│
└── src/
    ├── main.ts               # 애플리케이션 진입점
    ├── app.module.ts         # 루트 모듈
    │
    ├── common/               # 공통 기능
    │   └── filters/
    │       └── http-exception.filter.ts
    │
    └── todos/                # Todo 기능 모듈
        ├── todos.module.ts         # 모듈 정의
        ├── todos.controller.ts     # HTTP 요청 처리
        ├── todos.service.ts        # 비즈니스 로직
        ├── todos.repository.ts     # 데이터 접근
        ├── dto/
        │   ├── create-todo.dto.ts
        │   └── update-todo.dto.ts
        └── entities/
            └── todo.entity.ts
```

---

## 🏗️ 아키텍처

### 계층 구조

```
Controller (HTTP) → Service (Business Logic) → Repository (Data Access)
```

### 핵심 개념

#### 1. 모듈 시스템
```typescript
@Module({
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
```

#### 2. 의존성 주입
```typescript
@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}
}
```

#### 3. 데코레이터 기반 라우팅
```typescript
@Controller('todos')
export class TodosController {
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) { }

  @Get()
  findAll() { }

  @Get(':id')
  findOne(@Param('id') id: string) { }
}
```

#### 4. DTO 자동 검증
```typescript
export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(100)
  title: string;
}
```

자세한 아키텍처는 [Architecture.md](./Architecture.md)를 참고하세요.

---

## 🔧 개발 명령어

```bash
# 개발 서버 실행 (핫 리로드)
npm run start:dev

# 빌드
npm run build

# 프로덕션 실행
npm run start:prod

# 코드 포맷팅
npm run format

# 린트
npm run lint
```

---

## ✅ 검증 규칙

### Todo 생성/수정 시

- **title**
  - 필수 항목
  - 1-100자
  - 공백만 있는 경우 불가

- **description**
  - 선택 항목
  - 최대 500자

- **completed**
  - boolean 타입만 허용

---

## ⚠️ 에러 처리

### 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "timestamp": "2024-01-29T10:00:00.000Z",
  "path": "/todos"
}
```

### 주요 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `VALIDATION_ERROR` | 400 | 입력값 검증 실패 |
| `NOT_FOUND` | 404 | Todo를 찾을 수 없음 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 🎨 NestJS만의 장점

### 1. 강력한 타입 안정성
```typescript
const todo: Todo = this.todosService.findOne(id);
// 컴파일 타임에 타입 체크
```

### 2. 자동 검증
```typescript
@IsNotEmpty()
@MaxLength(100)
title: string;
// ValidationPipe가 자동으로 검증
```

### 3. 의존성 자동 관리
```typescript
constructor(private readonly todosService: TodosService) {}
// NestJS가 자동으로 인스턴스 주입
```

### 4. 간결한 라우팅
```typescript
@Get(':id')
findOne(@Param('id') id: string) { }
// 데코레이터로 명확한 의도 표현
```

---

## 📊 다른 프레임워크와 비교

| 항목 | Vanilla | Express | **NestJS** | Fastify |
|------|---------|---------|------------|---------|
| TypeScript | ❌ | ❌ | ✅ 완전 지원 | △ 부분 지원 |
| 구조화 | 수동 | 중간 | ✅ 강력 | 중간 |
| DI | 수동 | 수동 | ✅ 자동 | 수동 |
| 검증 | 수동 | 미들웨어 | ✅ 자동 | 스키마 |
| 학습 곡선 | 낮음 | 중간 | 높음 | 중간 |
| 대규모 프로젝트 | 어려움 | 중간 | ✅ 최적 | 중간 |

---

## 🔄 데이터 저장 방식

### 현재 (Phase 1)
- 메모리 기반 저장
- 서버 재시작 시 데이터 초기화

### 향후 (Phase 2)
```typescript
// TypeORM 사용 예정
@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;
  // ...
}
```

---

## 🚀 향후 확장 계획

### Phase 2: 데이터베이스
- TypeORM 또는 Prisma 연동
- PostgreSQL 연결
- 마이그레이션 관리

### Phase 3: 인증 & 인가
- JWT 토큰 기반 인증
- Guards 사용
- 사용자별 Todo 분리

### Phase 4: 고급 기능
- Swagger API 문서 자동 생성
- 단위 테스트 & E2E 테스트
- 로깅 (Winston)
- 캐싱 (Redis)

---

## 📚 학습 리소스

### 공식 문서
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)

### 추천 학습 순서
1. [Architecture.md](./Architecture.md) 읽기
2. [API-Specification.md](../00-Design/Api_specification.md) 읽기
3. 코드 실행 및 API 테스트
4. 각 파일 분석 (Controller → Service → Repository)
5. Vanilla, Express 버전과 비교

---

## 💡 학습 팁

### NestJS 처음 배우는 경우

1. **데코레이터 이해하기**
   - `@Controller`, `@Get`, `@Post` 등의 의미 파악
   - TypeScript의 데코레이터 개념 학습

2. **의존성 주입 이해하기**
   - `constructor`에서 자동으로 주입되는 원리
   - `@Injectable()` 데코레이터의 역할

3. **모듈 시스템 이해하기**
   - 모듈이 어떻게 구성되는지
   - `imports`, `providers`, `controllers`의 역할

4. **다른 버전과 비교하기**
   - Vanilla 버전의 수동 구현과 비교
   - Express 버전과 코드량 비교
   - NestJS의 자동화 이점 체감

---

## ❓ FAQ

### Q1: NestJS는 언제 사용하나요?
**A:** 대규모 프로젝트, 팀 협업, 엔터프라이즈급 애플리케이션에 적합합니다.

### Q2: TypeScript를 꼭 사용해야 하나요?
**A:** NestJS는 TypeScript를 기본으로 하므로 권장합니다.

### Q3: Express와 어떻게 다른가요?
**A:** NestJS는 Express 위에 구조화와 패턴을 추가한 프레임워크입니다.

### Q4: 학습이 어렵나요?
**A:** 초기 학습 곡선이 있지만, 구조화와 타입 안정성의 이점이 큽니다.

---

## 🤝 기여

이 프로젝트는 학습 목적으로 만들어졌습니다.

개선 사항이나 버그를 발견하면 이슈를 등록해주세요.

---

## 📄 라이선스

MIT License

---

## 🎓 관련 문서

- [Requirements.md](../00-Design/Requirements.md) - 요구사항 정의서
- [ERD.md](../00-Design/Erd.md) - 데이터베이스 설계
- [API-Specification.md](../00-Design/Api_specification.md) - API 명세서
- [Architecture.md](./Architecture.md) - NestJS 아키텍처 설계

---

**"NestJS로 엔터프라이즈급 아키텍처를 경험하세요!"** 🚀

---

## 📞 문의

프로젝트에 대한 질문이나 피드백은 이슈로 남겨주세요.

Happy Coding! 🎉
