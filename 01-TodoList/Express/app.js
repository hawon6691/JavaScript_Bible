/**
 * Express Application
 *
 * What: Express 앱 설정 및 미들웨어 구성
 * Why: 앱 설정과 서버 시작 로직 분리
 * How: Express 인스턴스 생성, 미들웨어 등록, 라우터 연결
 */

const express = require('express');
const todoRoutes = require('./routes/todos');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Express 앱 생성
const app = express();

// 미들웨어 등록 (순서 중요!)

// 1. CORS 설정 (프론트엔드 연동용)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 2. 요청 로깅
app.use(logger);

// 2. JSON 파싱 (Express 내장)
app.use(express.json());

// 3. API 라우트
app.use('/todos', todoRoutes);

// 4. 404 핸들러 (라우트 매칭 실패 시)
app.use(notFound);

// 5. 전역 에러 핸들러 (항상 마지막)
app.use(errorHandler);

module.exports = app;
