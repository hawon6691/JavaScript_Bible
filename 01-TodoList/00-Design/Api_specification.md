# API Specification (API 명세서)

## 🌐 기본 정보

- **Base URL**: `http://localhost:3000`
- **API Version**: `v1`
- **Protocol**: HTTP/1.1
- **Data Format**: JSON
- **Character Encoding**: UTF-8

---

## 📡 API 엔드포인트 목록

| Method | Endpoint | 설명 | 상태 코드 |
|--------|----------|------|-----------|
| POST | `/todos` | Todo 생성 | 201 |
| GET | `/todos` | Todo 목록 조회 | 200 |
| GET | `/todos/:id` | 특정 Todo 조회 | 200, 404 |
| PUT | `/todos/:id` | Todo 전체 수정 | 200, 404 |
| PATCH | `/todos/:id` | Todo 부분 수정 | 200, 404 |
| DELETE | `/todos/:id` | Todo 삭제 | 200, 404 |
| PATCH | `/todos/:id/toggle` | Todo 완료 상태 토글 | 200, 404 |

---

## 📝 상세 API 명세

### 1. Todo 생성

**POST** `/todos`

새로운 Todo를 생성합니다.

#### Request

**Headers**
```http
Content-Type: application/json
```

**Body**
```json
{
  "title": "Node.js 공부하기",
  "description": "Express와 NestJS 비교하며 학습" // optional
}
```

**필드 설명**
- `title` (required): 할 일 제목 (1-100자)
- `description` (optional): 할 일 설명 (최대 500자)

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Node.js 공부하기",
    "description": "Express와 NestJS 비교하며 학습",
    "completed": false,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

**검증 규칙**
- title이 없는 경우: `Title is required`
- title이 빈 문자열: `Title cannot be empty`
- title이 100자 초과: `Title must be 100 characters or less`
- description이 500자 초과: `Description must be 500 characters or less`

---

### 2. Todo 목록 조회

**GET** `/todos`

모든 Todo 목록을 조회합니다.

#### Request

**Headers**
```http
Accept: application/json
```

**Query Parameters** (Optional)
```
없음 (향후 필터링, 정렬, 페이지네이션 추가 예정)
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "첫 번째 할 일",
      "description": "설명",
      "completed": true,
      "createdAt": "2024-01-29T09:00:00.000Z",
      "updatedAt": "2024-01-29T15:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "두 번째 할 일",
      "description": "",
      "completed": false,
      "createdAt": "2024-01-29T10:00:00.000Z",
      "updatedAt": "2024-01-29T10:00:00.000Z"
    }
  ],
  "message": "Todos retrieved successfully",
  "count": 2
}
```

**Empty List (200 OK)**
```json
{
  "success": true,
  "data": [],
  "message": "No todos found",
  "count": 0
}
```

**특징**
- 생성 시간 기준 최신순 정렬 (createdAt DESC)
- 빈 목록도 성공(200) 응답

---

### 3. 특정 Todo 조회

**GET** `/todos/:id`

ID로 특정 Todo의 상세 정보를 조회합니다.

#### Request

**URL Parameters**
- `id`: Todo의 고유 ID (UUID 형식)

**Example**
```
GET /todos/550e8400-e29b-41d4-a716-446655440000
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Node.js 공부하기",
    "description": "Express와 NestJS 비교하며 학습",
    "completed": false,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
  },
  "message": "Todo retrieved successfully"
}
```

**Error (404 Not Found)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found with id: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### 4. Todo 전체 수정

**PUT** `/todos/:id`

Todo의 모든 필드를 수정합니다 (전체 교체).

#### Request

**URL Parameters**
- `id`: Todo의 고유 ID

**Headers**
```http
Content-Type: application/json
```

**Body** (모든 필드 필수)
```json
{
  "title": "수정된 제목",
  "description": "수정된 설명",
  "completed": true
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "수정된 제목",
    "description": "수정된 설명",
    "completed": true,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T15:30:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

**Error (404 Not Found)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found with id: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

---

### 5. Todo 부분 수정

**PATCH** `/todos/:id`

Todo의 일부 필드만 수정합니다 (부분 교체).

#### Request

**URL Parameters**
- `id`: Todo의 고유 ID

**Headers**
```http
Content-Type: application/json
```

**Body** (수정할 필드만 포함)
```json
{
  "title": "새 제목"
}
```

또는

```json
{
  "completed": true
}
```

또는

```json
{
  "title": "새 제목",
  "description": "새 설명"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "새 제목",
    "description": "기존 설명",
    "completed": false,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T15:30:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

**특징**
- 제공된 필드만 업데이트
- 제공되지 않은 필드는 기존 값 유지
- updatedAt은 자동 갱신

---

### 6. Todo 삭제

**DELETE** `/todos/:id`

특정 Todo를 삭제합니다.

#### Request

**URL Parameters**
- `id`: Todo의 고유 ID

**Example**
```
DELETE /todos/550e8400-e29b-41d4-a716-446655440000
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "삭제된 할 일",
    "description": "설명",
    "completed": false,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
  },
  "message": "Todo deleted successfully"
}
```

**Error (404 Not Found)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found with id: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**특징**
- 삭제 성공 시 삭제된 Todo 정보 반환
- 영구 삭제 (복구 불가능)

---

### 7. Todo 완료 상태 토글

**PATCH** `/todos/:id/toggle`

Todo의 완료 상태를 토글합니다 (true ↔ false).

#### Request

**URL Parameters**
- `id`: Todo의 고유 ID

**Example**
```
PATCH /todos/550e8400-e29b-41d4-a716-446655440000/toggle
```

**Body**
```
없음 (Body 불필요)
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "할 일",
    "description": "설명",
    "completed": true,  // false → true로 변경됨
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T15:30:00.000Z"
  },
  "message": "Todo toggled successfully"
}
```

**Error (404 Not Found)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found with id: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**특징**
- 현재 상태와 반대로 변경
- false → true, true → false
- 가장 자주 사용되는 기능이므로 별도 엔드포인트 제공

---

## 🔢 HTTP 상태 코드

| 코드 | 의미 | 사용 시점 |
|------|------|----------|
| 200 | OK | 조회, 수정, 삭제 성공 |
| 201 | Created | 생성 성공 |
| 400 | Bad Request | 잘못된 요청 (검증 실패) |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 내부 오류 |

---

## 📋 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {}, // 또는 []
  "message": "Operation successful"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

---

## ❌ 에러 코드 목록

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `VALIDATION_ERROR` | 400 | 입력값 검증 실패 |
| `NOT_FOUND` | 404 | Todo를 찾을 수 없음 |
| `INVALID_JSON` | 400 | 잘못된 JSON 형식 |
| `METHOD_NOT_ALLOWED` | 405 | 허용되지 않은 HTTP 메서드 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## 🔍 검증 에러 메시지

| 에러 상황 | 메시지 |
|----------|--------|
| title 누락 | `Title is required` |
| title 빈 문자열 | `Title cannot be empty` |
| title 길이 초과 | `Title must be 100 characters or less` |
| description 길이 초과 | `Description must be 500 characters or less` |
| completed 타입 오류 | `Completed must be a boolean` |
| 잘못된 JSON | `Invalid JSON format` |

---

## 📊 요청/응답 예시

### 시나리오: Todo 생성부터 삭제까지

#### 1️⃣ Todo 생성
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript 바이블 완성하기",
    "description": "모든 프레임워크로 TodoList 구현"
  }'
```

#### 2️⃣ 목록 조회
```bash
curl -X GET http://localhost:3000/todos
```

#### 3️⃣ 특정 Todo 조회
```bash
curl -X GET http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000
```

#### 4️⃣ 완료 상태 토글
```bash
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000/toggle
```

#### 5️⃣ 부분 수정
```bash
curl -X PATCH http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "수정된 제목"
  }'
```

#### 6️⃣ 삭제
```bash
curl -X DELETE http://localhost:3000/todos/550e8400-e29b-41d4-a716-446655440000
```

---

## 🎯 REST 원칙 준수

### 1. 리소스 기반 URL
- ✅ `/todos` - 리소스 중심
- ❌ `/getTodos`, `/createTodo` - 동작 중심 (잘못된 방식)

### 2. HTTP 메서드 의미
- **GET**: 조회 (읽기 전용, 멱등성)
- **POST**: 생성 (비멱등성)
- **PUT**: 전체 수정 (멱등성)
- **PATCH**: 부분 수정 (멱등성)
- **DELETE**: 삭제 (멱등성)

### 3. 적절한 상태 코드
- 2xx: 성공
- 4xx: 클라이언트 오류
- 5xx: 서버 오류

### 4. 일관된 응답 형식
- 모든 응답에 `success`, `data/error`, `message` 포함

---

## 📝 향후 확장 API

### 검색 & 필터링
```
GET /todos?completed=true
GET /todos?search=Node.js
GET /todos?sort=createdAt&order=desc
```

### 페이지네이션
```
GET /todos?page=1&limit=10
```

### 일괄 삭제
```
DELETE /todos/bulk
Body: { "ids": ["id1", "id2", "id3"] }
```

---

**"명확한 API 명세는 프론트엔드 개발자와의 소통을 원활하게 한다"**