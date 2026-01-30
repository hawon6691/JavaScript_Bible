# TodoList API - 설계 문서

## 📚 개요

JavaScript Backend Bible 프로젝트의 첫 번째 프로젝트인 **TodoList API**의 완벽한 설계 문서입니다.

이 설계 문서들은 **What-Why-How** 원칙을 따라 작성되었습니다.

---

## 📋 문서 목록

### 1. [Requirements.md](./Requirements.md) - 요구사항 정의서
**WHAT**: 무엇을 만들 것인가?
- 기능 요구사항 (CRUD)
- 비기능 요구사항 (성능, 보안, 안정성)
- 데이터 요구사항
- 제약사항
- 성공 기준

### 2. [ERD.md](./ERD.md) - 데이터베이스 설계
**WHAT**: 어떤 데이터를 다룰 것인가?
- Todo 엔티티 구조
- 필드 상세 설명
- 데이터 저장 방식 (메모리 → 파일 → DB)
- 데이터 무결성 규칙
- 샘플 데이터

### 3. [API-Specification.md](./API-Specification.md) - API 명세서
**HOW**: 어떻게 사용할 것인가?
- 7개 API 엔드포인트 상세 명세
- 요청/응답 예시
- HTTP 상태 코드
- 에러 처리
- cURL 예제

### 4. [Architecture.md](./Architecture.md) - 아키텍처 설계
**WHY & HOW**: 왜 이렇게 설계하고, 어떻게 구현할 것인가?
- 계층화 아키텍처 (Layered Architecture)
- 계층별 책임 (Controller → Service → Repository)
- 설계 패턴 (Repository Pattern, DI)
- 요청 흐름
- 에러 처리 전략
- 보안 고려사항

---

## 🎯 설계 원칙

### What-Why-How 구조
```
📖 WHAT (이것이 무엇인가?)
  └─ 프로젝트 개요, 기능, 도메인 모델

🤔 WHY (왜 이렇게 만들어야 하는가?)
  └─ 설계 결정의 이유, 장단점, 필요성

⚙️ HOW (어떻게 사용/구현해야 하는가?)
  └─ 구현 방법, 코드 예시, 베스트 프랙티스
```

---

## 🚀 다음 단계

### 1. 설계 문서 읽기
모든 설계 문서를 꼼꼼히 읽고 이해하기

### 2. VS Code의 Claude Code로 구현
```bash
# Vanilla-Right 디렉토리 생성
mkdir -p Vanilla-Right

# 설계 문서 기반으로 코드 작성
# - server.js
# - routes/todoRoutes.js
# - controllers/todoController.js
# - services/todoService.js
# - repositories/todoRepository.js
# - 기타 필요한 파일들
```

### 3. 구현 시 체크리스트
- [ ] 모든 함수에 주석 달기 (What, Why, How)
- [ ] API 명세서와 정확히 일치하는 응답 형식
- [ ] 에러 처리 완벽히 구현
- [ ] 입력값 검증 철저히
- [ ] 계층 분리 준수 (Controller-Service-Repository)

---

## 📁 프로젝트 구조 (예정)

```
01-TodoList/
├── 00-Design/              # ✅ 현재 위치 (설계 완료)
│   ├── Requirements.md
│   ├── ERD.md
│   ├── API-Specification.md
│   └── Architecture.md
│
├── Vanilla-Right/          # ⏳ 다음 단계 (구현 예정)
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── data/
│
├── Vanilla-Wrong/          # ❌ 잘못된 예제 (나중에)
├── Express-Right/          # ✅ Express 올바른 예제
├── Express-Wrong/          # ❌ Express 잘못된 예제
├── NestJS-Right/           # ✅ NestJS 올바른 예제
├── NestJS-Wrong/           # ❌ NestJS 잘못된 예제
├── Fastify-Right/          # ✅ Fastify 올바른 예제
└── Fastify-Wrong/          # ❌ Fastify 잘못된 예제
```

---

## 💡 핵심 개념

### RESTful API 원칙
- 리소스 중심 URL (`/todos`, `/todos/:id`)
- HTTP 메서드 활용 (GET, POST, PUT, PATCH, DELETE)
- 적절한 상태 코드 (200, 201, 400, 404, 500)
- 일관된 응답 형식

### 계층화 아키텍처
```
Client → Router → Controller → Service → Repository → Data
```

각 계층은 명확한 책임을 가지며, 상위 계층은 하위 계층만 의존합니다.

### Repository Pattern
데이터 접근 로직을 추상화하여 저장소 변경(메모리→파일→DB)이 쉽도록 설계

---

## 📖 성경과의 비교

성경의 구조처럼 이 프로젝트도:
- **창세기**: 프로젝트의 시작과 원칙 정의 (Requirements)
- **레위기**: 규칙과 표준 (API Specification)
- **복음서**: 올바른 길과 잘못된 길 (Right vs Wrong)

각 문서는 **독립적으로 읽을 수 있지만**, **함께 읽으면 완전한 그림**을 그릴 수 있습니다.

---

## ✅ 설계 완료 체크리스트

- [x] 요구사항 정의 완료
- [x] 데이터 모델 설계 완료
- [x] API 명세서 작성 완료
- [x] 아키텍처 설계 완료
- [ ] Vanilla-Right 구현 (다음 단계)
- [ ] Vanilla-Wrong 구현
- [ ] Express 버전 구현
- [ ] NestJS 버전 구현
- [ ] Fastify 버전 구현

---

**"좋은 설계는 좋은 구현의 시작이다"**

이제 VS Code의 Claude Code로 이 설계를 바탕으로 완벽한 코드를 작성하세요! 🚀