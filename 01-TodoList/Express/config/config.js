/**
 * 애플리케이션 설정
 *
 * What: 서버 및 애플리케이션 설정 관리
 * Why: 환경별 설정을 중앙에서 관리하여 유지보수성 향상
 * How: 환경 변수와 기본값을 조합하여 설정 객체 생성
 */

const config = {
  // 실행 환경
  env: process.env.NODE_ENV || 'development',

  // 서버 설정
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost',
  },

  // 데이터 파일 경로
  data: {
    filePath: process.env.DATA_FILE_PATH || './data/todos.json',
  },

  // 종료 설정
  shutdown: {
    timeout: parseInt(process.env.SHUTDOWN_TIMEOUT, 10) || 5000,
  },
};

module.exports = config;
