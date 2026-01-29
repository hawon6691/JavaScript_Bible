/**
 * TodoList API Server
 *
 * What: HTTP 서버 생성 및 실행
 * Why: API 요청을 수신하고 처리하기 위한 진입점
 * How: Node.js 내장 http 모듈로 서버 생성, MySQL 데이터베이스 연결
 *
 * @author JavaScript Bible Project
 * @version 1.0.0
 */

// 환경변수 로드 (가장 먼저 실행)
require('dotenv').config();

const http = require('http');
const router = require('./routes/todoRoutes');
const config = require('./config/config');
const { initialize: initializeDatabase } = require('./config/database');

// HTTP 서버 생성
const server = http.createServer(router);

// 서버 시작 함수
async function startServer() {
  console.log('='.repeat(50));
  console.log('  TodoList API Server');
  console.log('='.repeat(50));
  console.log(`  Environment: ${config.env}`);

  // 데이터베이스 초기화
  console.log('');
  console.log('Initializing database...');
  const dbConnected = await initializeDatabase();

  if (!dbConnected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

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

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 서버 시작
startServer();

module.exports = server;
