/**
 * Configuration Module
 *
 * What: 애플리케이션 설정 관리
 * Why: 설정을 중앙화하여 유지보수 용이
 * How: 환경 변수 또는 기본값 사용
 */

const {
  DEFAULT_PORT,
  DEFAULT_HOST,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_BODY_SIZE,
  SHUTDOWN_TIMEOUT
} = require('../utils/constants');

const config = {
  // 서버 설정
  server: {
    port: parseInt(process.env.PORT, 10) || DEFAULT_PORT,
    host: process.env.HOST || DEFAULT_HOST
  },

  // 환경 설정
  env: process.env.NODE_ENV || 'development',

  // CORS 설정
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    headers: 'Content-Type'
  },

  // 데이터 검증 설정
  validation: {
    title: {
      minLength: MIN_TITLE_LENGTH,
      maxLength: MAX_TITLE_LENGTH
    },
    description: {
      maxLength: MAX_DESCRIPTION_LENGTH
    }
  },

  // 요청 제한 설정
  limits: {
    maxBodySize: MAX_BODY_SIZE
  },

  // Graceful Shutdown 설정
  shutdown: {
    timeout: SHUTDOWN_TIMEOUT
  }
};

module.exports = config;
