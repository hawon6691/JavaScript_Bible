# JavaScript Backend Bible - 프로젝트 구조 가이드

## 📁 최종 확정 구조

```
JavaScript-Backend-Bible/
│
├── 01-TodoList/
│   │
│   ├── 00-Design/                    # 공통 설계 문서
│   │   ├── README.md                 # 설계 문서 소개
│   │   ├── Requirements.md           # 요구사항 (공통)
│   │   ├── ERD.md                    # 데이터 설계 (공통)
│   │   └── API-Specification.md      # API 명세 (공통)
│   │
│   ├── Vanilla/                      # ✅ Vanilla Node.js 구현
│   │   ├── README.md                 # 실행 방법
│   │   ├── Architecture.md           # Vanilla 전용 아키텍처
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── routes/
│   │   │   └── todoRoutes.js
│   │   ├── controllers/
│   │   │   └── todoController.js
│   │   ├── services/
│   │   │   └── todoService.js
│   │   ├── repositories/
│   │   │   └── todoRepository.js
│   │   ├── models/
│   │   │   └── Todo.js
│   │   ├── middlewares/
│   │   │   ├── jsonParser.js
│   │   │   ├── logger.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── validator.js
│   │   │   ├── response.js
│   │   │   ├── uuid.js
│   │   │   └── constants.js
│   │   └── data/
│   │       └── todos.json
│   │
│   ├── Express/                      # ✅ Express 구현
│   │   ├── README.md
│   │   ├── Architecture.md           # Express 전용 아키텍처
│   │   ├── package.json
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/
│   │   │   └── todos.js
│   │   ├── controllers/
│   │   │   └── todoController.js
│   │   ├── services/
│   │   │   └── todoService.js
│   │   ├── repositories/
│   │   │   └── todoRepository.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   └── utils/
│   │       └── validator.js
│   │
│   ├── NestJS/                       # ✅ NestJS 구현
│   │   ├── README.md
│   │   ├── Architecture.md           # NestJS 전용 아키텍처
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       └── todos/
│   │           ├── todos.module.ts
│   │           ├── todos.controller.ts
│   │           ├── todos.service.ts
│   │           ├── todos.repository.ts
│   │           ├── dto/
│   │           │   ├── create-todo.dto.ts
│   │           │   └── update-todo.dto.ts
│   │           └── entities/
│   │               └── todo.entity.ts
│   │
│   └── Fastify/                      # ✅ Fastify 구현
│       ├── README.md
│       ├── Architecture.md           # Fastify 전용 아키텍처
│       ├── package.json
│       ├── server.js
│       ├── routes/
│       │   └── todos.js
│       ├── controllers/
│       │   └── todoController.js
│       ├── services/
│       │   └── todoService.js
│       ├── repositories/
│       │   └── todoRepository.js
│       ├── schemas/
│       │   └── todoSchema.js
│       └── plugins/
│           └── cors.js
│
├── 02-PostBoard/                     # 두 번째 프로젝트
│   ├── 00-Design/
│   ├── Vanilla/
│   ├── Express/
│   ├── NestJS/
│   └── Fastify/
│
├── 03-Shop/                          # 세 번째 프로젝트
├── 04-Calendar/
├── 05-Community/
└── 06-Health/
```

---

## 📊 문서 분류

### 공통 문서 (00-Design/)

| 문서 | 위치 | 공통/개별 | 프레임워크 의존 |
|------|------|----------|----------------|
| README.md | 00-Design/ | 공통 | ❌ 없음 |
| Requirements.md | 00-Design/ | 공통 | ❌ 없음 |
| ERD.md | 00-Design/ | 공통 | ❌ 없음 |
| API-Specification.md | 00-Design/ | 공통 | ❌ 없음 |

### 프레임워크별 문서

| 문서 | 위치 | 공통/개별 | 프레임워크 의존 |
|------|------|----------|----------------|
| README.md | 각 프레임워크/ | 개별 | ✅ 높음 |
| Architecture.md | 각 프레임워크/ | 개별 | ✅ 높음 |

---

## 🎯 핵심 원칙

### 1. 설계는 공통, 구현은 다양

```
공통 설계 (00-Design/)
├── 무엇을 (WHAT) → Requirements.md
├── 어떤 데이터를 (WHAT) → ERD.md
└── 어떻게 사용 (HOW) → API-Specification.md

프레임워크별 구현
├── 어떻게 구현 (HOW) → Architecture.md
└── 실제 코드 → 각 프레임워크별 구조
```

### 2. 문서 역할 분리

| 질문 | 답변 문서 | 공통/개별 |
|------|----------|----------|
| 무엇을 만드나? | Requirements.md | 공통 |
| 왜 필요한가? | Requirements.md | 공통 |
| 어떤 데이터인가? | ERD.md | 공통 |
| API는 어떻게 쓰나? | API-Specification.md | 공통 |
| 어떻게 구현하나? | Architecture.md | 개별 |
| 어떻게 실행하나? | README.md | 개별 |

---

## ✅ 각 파일의 역할

### 00-Design/README.md
```markdown
# 역할
- 전체 설계 문서 소개
- 학습 가이드
- 프레임워크 비교 개요

# 대상
- 프로젝트 처음 시작하는 사람
- 전체 구조 파악하려는 사람
```

### 00-Design/Requirements.md
```markdown
# 역할
- 기능 요구사항 (FR)
- 비기능 요구사항 (NFR)
- 제약사항
- 성공 기준

# 대상
- 기획자, PM
- 개발자 (요구사항 확인)
```

### 00-Design/ERD.md
```markdown
# 역할
- 데이터 모델 정의
- 필드 상세 설명
- 저장 방식 설계

# 대상
- 백엔드 개발자
- DBA
```

### 00-Design/API-Specification.md
```markdown
# 역할
- API 엔드포인트 정의
- 요청/응답 예시
- 에러 코드

# 대상
- 프론트엔드 개발자
- API 사용자
```

### {프레임워크}/Architecture.md
```markdown
# 역할
- 프레임워크별 아키텍처
- 디렉토리 구조
- 핵심 코드 예시
- 설계 패턴

# 대상
- 백엔드 개발자 (해당 프레임워크)
```

### {프레임워크}/README.md
```markdown
# 역할
- 설치 방법
- 실행 방법
- 테스트 방법
- API 사용 예시

# 대상
- 개발자 (바로 실행하려는 사람)
```

---

## 🔄 작업 흐름

### 새 프로젝트 추가 시

```bash
# 1. 설계 문서 먼저 작성
mkdir 0X-ProjectName/00-Design
cd 0X-ProjectName/00-Design

# 2. 공통 문서 작성
touch README.md
touch Requirements.md
touch ERD.md
touch API-Specification.md

# 3. 프레임워크별 폴더 생성
cd ..
mkdir Vanilla Express NestJS Fastify

# 4. 각 프레임워크별 문서 작성
# Vanilla/Architecture.md
# Vanilla/README.md
# Express/Architecture.md
# Express/README.md
# ...

# 5. 코드 작성
# 각 프레임워크별로 구현
```

---

## 📋 체크리스트

### 설계 단계
- [ ] Requirements.md 작성
- [ ] ERD.md 작성
- [ ] API-Specification.md 작성
- [ ] 00-Design/README.md 작성

### Vanilla 구현
- [ ] Vanilla/Architecture.md 작성
- [ ] Vanilla/README.md 작성
- [ ] 코드 구현
- [ ] 테스트

### Express 구현
- [ ] Express/Architecture.md 작성
- [ ] Express/README.md 작성
- [ ] 코드 구현
- [ ] Vanilla와 비교 문서

### NestJS 구현
- [ ] NestJS/Architecture.md 작성
- [ ] NestJS/README.md 작성
- [ ] 코드 구현
- [ ] Express와 비교 문서

### Fastify 구현
- [ ] Fastify/Architecture.md 작성
- [ ] Fastify/README.md 작성
- [ ] 코드 구현
- [ ] 전체 프레임워크 비교

---

## 💡 추가 폴더 (선택 사항)

```
01-TodoList/
├── 00-Design/
├── Vanilla/
├── Express/
├── NestJS/
├── Fastify/
│
├── 99-Comparison/              # 선택: 프레임워크 비교
│   ├── PERFORMANCE.md          # 성능 비교
│   ├── CODE_SIZE.md            # 코드량 비교
│   └── LEARNING_CURVE.md       # 학습 곡선 비교
│
└── 98-Common/                  # 선택: 공통 리소스
    ├── ANTI_PATTERNS.md        # 안티패턴 모음
    └── BEST_PRACTICES.md       # 베스트 프랙티스
```

---

## 🎯 핵심 메시지

### "하나의 원칙, 다양한 구현"

```
동일한 목표:
✅ 같은 API 명세 구현
✅ 같은 요구사항 충족
✅ 같은 데이터 구조 사용

다양한 방법:
⚡ Vanilla: 순수 Node.js (기본 원리 학습)
⚡ Express: 미들웨어 체인 (실용성)
⚡ NestJS: 엔터프라이즈 구조 (확장성)
⚡ Fastify: 성능 최적화 (속도)
```

---

## 📚 학습 경로

### 추천 순서

```
1. 설계 문서 읽기
   └─ 00-Design/ 전체 읽기

2. Vanilla 구현
   └─ 기본 원리 이해

3. Express 구현
   └─ 프레임워크 편의성 체험

4. NestJS 구현
   └─ 엔터프라이즈급 구조 학습

5. Fastify 구현
   └─ 성능 최적화 방법 학습

6. 비교 분석
   └─ 각 프레임워크의 장단점 정리
```

---

**"완벽한 예제만 만들어서, 완벽한 학습 자료로!"** 🚀