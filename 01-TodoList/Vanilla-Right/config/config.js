/**
 * Configuration Module
 *
 * What: 애플리케이션 설정 관리
 * Why: 설정을 중앙화하여 유지보수 용이
 * How: 환경 변수 또는 기본값 사용
 */

const config = {
  // 서버 설정
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost'
  },

  // 환경 설정
  env: process.env.NODE_ENV || 'development',

  // 데이터 검증 설정
  validation: {
    title: {
      minLength: 1,
      maxLength: 100
    },
    description: {
      maxLength: 500
    }
  },

  // 요청 제한 설정
  limits: {
    maxBodySize: 1048576 // 1MB
  }
};

module.exports = config;
