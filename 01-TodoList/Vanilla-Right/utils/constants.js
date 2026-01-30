/**
 * Constants Module
 *
 * What: 애플리케이션 전역 상수 정의
 * Why: Magic Number를 제거하고 일관성 유지
 * How: 중앙 집중식 상수 관리
 */

module.exports = {
  // 검증 관련 상수
  MAX_TITLE_LENGTH: 100,
  MIN_TITLE_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 500,

  // 요청 제한
  MAX_BODY_SIZE: 1048576, // 1MB

  // 서버 설정
  DEFAULT_PORT: 3000,
  DEFAULT_HOST: 'localhost',

  // Graceful Shutdown
  SHUTDOWN_TIMEOUT: 10000 // 10초
};
