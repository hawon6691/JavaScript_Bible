/**
 * TodoList API Server (Express)
 *
 * What: HTTP 서버 생성 및 실행
 * Why: API 요청을 수신하고 처리하기 위한 진입점
 * How: Express 앱을 HTTP 서버로 실행
 */

// 환경변수 로드 (가장 먼저!)
require('dotenv').config();

const app = require('./app');
const config = require('./config/config');
const todoRepository = require('./repositories');

// MySQL 사용 시 database 모듈 로드
const database = process.env.STORAGE_TYPE === 'mysql'
  ? require('./config/database')
  : null;

// 서버 시작 함수
async function startServer() {
  console.log('='.repeat(50));
  console.log('  TodoList API Server (Express)');
  console.log('='.repeat(50));
  console.log(`  Environment: ${config.env}`);
  console.log(`  Storage: ${process.env.STORAGE_TYPE || 'memory'}`);

  // 데이터베이스 초기화 (MySQL 사용 시)
  console.log('');
  console.log('Initializing storage...');

  if (database) {
    await database.initialize();
  }

  // 저장된 데이터 로드
  await todoRepository.load();

  // 서버 시작
  const server = app.listen(config.server.port, config.server.host, () => {
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

  // 에러 핸들링
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Error: Port ${config.server.port} is already in use`);
    } else {
      console.error('Server error:', error.message);
    }
    process.exit(1);
  });

  // Graceful Shutdown
  async function gracefulShutdown(signal) {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    const shutdownTimeout = setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, config.shutdown.timeout);

    server.close(async () => {
      console.log('Server closed');

      try {
        await todoRepository.backup();

        // MySQL 연결 종료
        if (database) {
          await database.close();
        }

        console.log('Cleanup completed');
      } catch (error) {
        console.error('Cleanup failed:', error.message);
      }

      clearTimeout(shutdownTimeout);
      process.exit(0);
    });
  }

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
}

// 서버 시작
startServer();

module.exports = app;
