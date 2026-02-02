# TodoList API - 설계 문서

## 📚 개요

**JavaScript Backend Bible** 프로젝트의 첫 번째 프로젝트인 **TodoList API**의 완벽한 설계 문서입니다.

이 설계는 **프레임워크 중립적**이며, Vanilla Node.js, Express, NestJS, Fastify 등 모든 구현 버전에서 공통으로 사용됩니다.

모든 문서는 **What-Why-How** 원칙을 따라 작성되었습니다.

---

## 🎯 설계 원칙

### 프레임워크 중립적 설계

이 설계 문서들은 **어떤 프레임워크를 사용하든 동일**하게 적용됩니다:

- **요구사항**: "Todo를 생성/조회/수정/삭제할 수 있어야 한다"
- **데이터 구조**: id, title, description, completed, createdAt, updatedAt
- **API 명세**: POST /todos, GET /todos, PUT /todos/:id 등

**프레임워크는 구현 방법만 다를 뿐, 목표는 동일합니다.**

---

## 📋 문서 구성

### 1. [Requirements.md](./Requirements.md) - 요구사항 정의서

**무엇을(WHAT)** 만들 것인가?

- ✅ 기능 요구사항 (FR-01 ~ FR-18)
  - Todo 생성, 조회, 수정, 삭제, 토글
- ✅ 비기능 요구사항 (NFR-01 ~ NFR-12)
  - 성능, 보안, 안정성, 유지보수성, 확장성
- ✅ 데이터 요구사항
  - Todo 엔티티 구조 및 검증 규칙
- ✅ 제약사항 및 성공 기준

**프레임워크 의존도:** 없음 (모든 버전 공통)

---

### 2. [ERD.md](./ERD.md) - 데이터베이스 설계

**어떤 데이터를(WHAT)** 다룰 것인가?

- ✅ Todo 엔티티 구조
  ```javascript
  {
    id: UUID,
    title: string (1-100자),
    description: string (0-500자),
    completed: boolean,
    createdAt: ISO 8601,
    updatedAt: ISO 8601
  }
  ```
- ✅ 필드별 상세 설명 및 제약조건
- ✅ 데이터 저장 방식 진화 (메모리 → 파일 → DB)
- ✅ 인덱스 전략 및 데이터 무결성 규칙
- ✅ 샘플 데이터

**프레임워크 의존도:** 없음 (모든 버전 공통)

---

### 3. [API-Specification.md](./API-Specification.md) - API 명세서

**어떻게(HOW)** 사용할 것인가?

- ✅ 7개 RESTful API 엔드포인트
  - POST /todos - Todo 생성
  - GET /todos - 목록 조회
  - GET /todos/:id - 특정 Todo 조회
  - PUT /todos/:id - 전체 수정
  - PATCH /todos/:id - 부분 수정
  - DELETE /todos/:id - 삭제
  - PATCH /todos/:id/toggle - 완료 상태 토글
- ✅ 요청/응답 예시 (JSON)
- ✅ HTTP 상태 코드 (200, 201, 400, 404, 500)
- ✅ 에러 코드 및 검증 메시지
- ✅ cURL 사용 예제

**프레임워크 의존도:** 없음 (모든 버전 공통)

---

### 4. Architecture.md - 아키텍처 설계

**어떻게(HOW)** 구현할 것인가?

⚠️ **이 문서는 각 프레임워크 폴더에 별도로 존재합니다:**

- `../Vanilla/Architecture.md` - Vanilla Node.js 아키텍처
- `../Express/Architecture.md` - Express 아키텍처
- `../NestJS/Architecture.md` - NestJS 아키텍처
- `../Fastify/Architecture.md` - Fastify 아키텍처

**이유:** 각 프레임워크마다 구조와 패턴이 다르기 때문

**공통 내용:**
- 계층화 아키텍처 (Controller → Service → Repository)
- 설계 패턴 (Repository Pattern, Dependency Injection)
- 에러 처리 전략
- 보안 고려사항

**프레임워크별 차이:**
- **Vanilla**: 수동 라우팅, HTTP 서버 직접 구현
- **Express**: 라우터, 미들웨어 체인
- **NestJS**: 데코레이터, 모듈 시스템, DI 컨테이너
- **Fastify**: 스키마 기반 검증, 플러그인

---

## 📁 프로젝트 구조

```
01-TodoList/
│
├── 00-Design/                    # ← 현재 위치 (설계 문서)
│   ├── README.md                 # 이 파일
│   ├── Requirements.md           # 요구사항 (공통)
│   ├── ERD.md                    # 데이터 설계 (공통)
│   └── API-Specification.md      # API 명세 (공통)
│
├── Vanilla/                      # Vanilla Node.js 구현
│   ├── README.md                 # 실행 방법
│   ├── Architecture.md           # Vanilla 전용 아키텍처
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── repositories/
│
├── Express/                      # Express 구현
│   ├── README.md
│   ├── Architecture.md           # Express 전용 아키텍처
│   ├── app.js
│   └── ...
│
├── NestJS/                       # NestJS 구현
│   ├── README.md
│   ├── Architecture.md           # NestJS 전용 아키텍처
│   ├── src/
│   └── ...
│
└── Fastify/                      # Fastify 구현
    ├── README.md
    ├── Architecture.md           # Fastify 전용 아키텍처
    └── ...
```

---

## 🎓 학습 흐름

### 추천 학습 순서

#### 1단계: 설계 문서 읽기 (00-Design/)
```
Requirements.md → ERD.md → API-Specification.md
```
→ **목표**: "무엇을 만들 것인가" 이해

#### 2단계: Vanilla 구현 학습
```
Vanilla/Architecture.md → Vanilla/ 코드 분석
```
→ **목표**: 기본 원리 이해 (프레임워크 없이 구현)

#### 3단계: Express 구현 비교
```
Express/Architecture.md → Express/ 코드 분석
```
→ **목표**: "프레임워크가 무엇을 해주는가" 이해

#### 4단계: NestJS 구현 학습
```
NestJS/Architecture.md → NestJS/ 코드 분석
```
→ **목표**: 엔터프라이즈급 구조 이해

#### 5단계: Fastify 구현 비교
```
Fastify/Architecture.md → Fastify/ 코드 분석
```
→ **목표**: 성능 최적화 방식 이해

---

## 🔄 What-Why-How 구조

### WHAT (무엇을?)
> **Requirements.md, ERD.md, API-Specification.md**
- 무엇을 만들 것인가
- 어떤 기능이 필요한가
- 어떤 데이터를 다루는가

### WHY (왜?)
> **Requirements.md (비기능 요구사항)**
- 왜 이런 기능이 필요한가
- 왜 이렇게 설계해야 하는가

### HOW (어떻게?)
> **API-Specification.md, Architecture.md**
- 어떻게 사용하는가 (API)
- 어떻게 구현하는가 (Architecture)

---

## 💡 핵심 개념

### 1. RESTful API 원칙
```
리소스 중심 URL:    /todos, /todos/:id
HTTP 메서드 활용:   GET, POST, PUT, PATCH, DELETE
적절한 상태 코드:   200, 201, 400, 404, 500
일관된 응답 형식:   { success, data/error, message }
```

### 2. 계층화 아키텍처
```
Client
  ↓
Router/Controller  (HTTP 계층)
  ↓
Service           (비즈니스 로직 계층)
  ↓
Repository        (데이터 접근 계층)
  ↓
Data Storage      (저장소)
```

### 3. Repository Pattern
```
장점:
- 저장소 교체 용이 (메모리 → 파일 → DB)
- 테스트 시 Mock 가능
- 데이터 접근 로직 중앙화
```

---

## 📊 프레임워크 비교

| 항목 | Vanilla | Express | NestJS | Fastify |
|------|---------|---------|--------|---------|
| 학습 곡선 | ⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 코드량 | 많음 | 중간 | 중간 | 중간 |
| 성능 | 빠름 | 빠름 | 중간 | 매우 빠름 |
| 구조화 | 수동 | 중간 | 강력 | 중간 |
| 타입 안정성 | 없음 | 없음 | 강력 (TS) | 중간 |
| 의존성 | 0개 | 적음 | 많음 | 적음 |
| 적합한 경우 | 학습 | 소~중규모 | 대규모 | 고성능 |

**상세 비교는 각 구현 완료 후 추가 예정**

---

## ✅ 설계 체크리스트

- [x] 요구사항 정의 완료
- [x] 데이터 모델 설계 완료
- [x] API 명세서 작성 완료
- [ ] Vanilla 구현 및 아키텍처 문서 작성
- [ ] Express 구현 및 아키텍처 문서 작성
- [ ] NestJS 구현 및 아키텍처 문서 작성
- [ ] Fastify 구현 및 아키텍처 문서 작성
- [ ] 프레임워크 간 비교 분석 문서 작성

---

## 🚀 다음 단계

### 1. 설계 문서 완전 이해
- [ ] Requirements.md 정독
- [ ] ERD.md 정독
- [ ] API-Specification.md 정독

### 2. Vanilla 구현 시작
```bash
cd ../Vanilla
# Architecture.md 읽기
# 코드 작성 또는 분석
```

### 3. 다른 프레임워크 학습
- Vanilla 이해 → Express로 이동
- Express 이해 → NestJS로 이동
- NestJS 이해 → Fastify로 이동

---

## 📖 설계 철학

### "같은 목표, 다른 접근법"

모든 프레임워크 버전은:
- ✅ 동일한 요구사항 충족
- ✅ 동일한 API 명세 구현
- ✅ 동일한 데이터 구조 사용
- ✅ 계층화 아키텍처 원칙 준수

하지만:
- ⚡ 구현 방식은 각 프레임워크에 최적화
- ⚡ 코드 스타일은 프레임워크 관습 따름
- ⚡ 성능과 생산성의 균형점이 다름

---

## 💎 핵심 메시지

> **"설계는 공통, 구현은 다양"**

- ✅ 요구사항, 데이터 구조, API 명세는 **모든 프레임워크에서 동일**
- ✅ 아키텍처와 구현 방식은 **프레임워크별로 최적화**
- ✅ 같은 목표를 향한 다양한 접근법 학습

---

## 📚 추가 리소스 (예정)

### 확장 계획
- **Phase 2**: 사용자 인증, 우선순위, 마감일
- **Phase 3**: 카테고리, 검색, 필터링, 페이지네이션
- **Phase 4**: 데이터베이스, 캐싱, 파일 첨부, 알림

### 학습 자료
- `COMPARISON.md` - 프레임워크 간 상세 비교
- `BEST_PRACTICES.md` - 각 프레임워크별 베스트 프랙티스
- `MIGRATION_GUIDE.md` - 프레임워크 간 마이그레이션 가이드

---

## 📞 문서 활용 가이드

### 프론트엔드 개발자라면?
→ `API-Specification.md`만 보세요

### 백엔드 개발자라면?
→ 모든 문서를 순서대로 읽으세요

### 아키텍트라면?
→ `Requirements.md` + 각 `Architecture.md` 집중

### 학습자라면?
→ Vanilla부터 시작해서 단계적으로 학습

---

**"좋은 설계는 좋은 구현의 시작이다"**

이제 각 프레임워크 폴더로 이동하여 구현을 시작하세요! 🚀

---

## 🎯 빠른 시작

```bash
# 1. 설계 문서 읽기
cd 00-Design
# Requirements.md, ERD.md, API-Specification.md 읽기

# 2. Vanilla 구현 시작
cd ../Vanilla
# Architecture.md 읽고 코드 작성

# 3. Express로 비교 학습
cd ../Express
# Vanilla와 비교하며 학습

# 4. 프로젝트 확장
# NestJS, Fastify 순서로 학습
```

---

**JavaScript Backend Bible - "모든 프레임워크, 하나의 원칙"** 🌟