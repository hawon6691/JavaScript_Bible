-- =============================================
-- TodoList - MySQL Table Design
-- =============================================

-- todos 테이블 생성
CREATE TABLE IF NOT EXISTS todos (
  id VARCHAR(36) PRIMARY KEY,                              -- UUID (앱에서 생성)
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,

  -- 인덱스 (테이블 생성 시 함께 정의)
  INDEX idx_createdAt (createdAt DESC),
  INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 참고: PostgreSQL 버전
-- =============================================
-- CREATE TABLE todos (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   title VARCHAR(100) NOT NULL,
--   description VARCHAR(500) DEFAULT '',
--   completed BOOLEAN NOT NULL DEFAULT FALSE,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_created_at ON todos(created_at DESC);
-- CREATE INDEX idx_completed ON todos(completed);
