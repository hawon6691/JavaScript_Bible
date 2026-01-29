/**
 * TodoList API Server
 *
 * What: HTTP 서버 생성 및 실행
 * Why: API 요청을 수신하고 처리하기 위한 진입점
 * How: Node.js 내장 http 모듈로 서버 생성, 메모리 저장소 + 파일 백업
 *
 * @author JavaScript Bible Project
 * @version 1.0.0
 */

const http = require('http');
const router = require('./routes/todoRoutes');
const config = require('./config/config');
const todoRepository = require('./repositories/todoRepository');

// HTTP 서버 생성
const server = http.createServer(router);

// 서버 시작 함수
async function startServer() {
  console.log('='.repeat(50));
  console.log('  TodoList API Server (Vanilla)');
  console.log('='.repeat(50));
  console.log(`  Environment: ${config.env}`);

  // 저장된 데이터 로드
  console.log('');
  console.log('Loading data...');
  await todoRepository.load();

  // 서버 시작
  server.listen(config.server.port, config.server.host, () => {
    console.log('');
    console.log(`  Server running at: http://${config.server.host}:${config.server.port}`);
    console.log('='.repeat(50));
    console.log('');
    console.log('Available endpoints:');
    console.log('  POST   /todos           - Create a new todo');
    console.log('  GET    /todos           - Get all todos');
    console.log('  GET    /todos/:id       - Get a specific todo');
    console.log('  PUT    /todos/:id       - Update a todo (full)');
    console.log('  PATCH  /todos/:id       - Update a todo (partial)');
    console.log('  DELETE /todos/:id       - Delete a todo');
    console.log('  PATCH  /todos/:id/toggle - Toggle todo completion');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('='.repeat(50));
  });
}

// 에러 핸들링
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: Port ${config.server.port} is already in use`);
  } else {
    console.error('Server error:', error.message);
  }
  process.exit(1);
});

/**
 * Graceful Shutdown 처리
 * 서버 종료 시 데이터를 파일로 백업
 *
 * @param {string} signal - 수신된 시그널
 */
async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);

  // 타임아웃 설정
  const shutdownTimeout = setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, config.shutdown.timeout);

  server.close(async () => {
    console.log('Server closed');

    // 데이터 백업
    try {
      await todoRepository.backup();
      console.log('Data backup completed');
    } catch (error) {
      console.error('Data backup failed:', error.message);
    }

    clearTimeout(shutdownTimeout);
    process.exit(0);
  });
}

// Graceful shutdown 이벤트 핸들러
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 처리되지 않은 예외 처리
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 서버 시작
startServer();

module.exports = server;
