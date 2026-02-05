/**
 * Main Entry Point
 *
 * NestJS 애플리케이션의 진입점입니다.
 * 서버를 생성하고 구성한 후 실행합니다.
 *
 * 주요 설정:
 * - 전역 ValidationPipe: 자동 입력값 검증
 * - 전역 에러 필터: 일관된 에러 응답
 * - CORS: 크로스 오리진 요청 허용
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // NestJS 애플리케이션 생성
  const app = await NestFactory.create(AppModule);

  // CORS 활성화 (프론트엔드와의 통신을 위해)
  app.enableCors();

  // 전역 ValidationPipe 설정
  // class-validator 데코레이터를 사용한 자동 검증
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성이 있으면 에러
      transform: true, // 타입 자동 변환
      exceptionFactory: (errors) => {
        // 검증 에러 메시지 포맷팅 (nested DTO 지원)
        const flatten = (errs, parent = '') =>
          errs.flatMap((error) => {
            const path = parent ? `${parent}.${error.property}` : error.property;
            const own = Object.values(error.constraints || {}).map((msg) => ({
              field: path,
              errors: [msg],
            }));
            const children = error.children?.length ? flatten(error.children, path) : [];
            return [...own, ...children];
          });

        const messages = flatten(errors);

        return new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: messages[0]?.errors?.[0] || 'Validation failed',
            details: messages,
          },
        });
      },
    }),
  );

  // 전역 예외 필터 설정
  // 모든 HTTP 예외를 일관된 형식으로 응답
  app.useGlobalFilters(new HttpExceptionFilter());

  // 서버 시작
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 TodoList API Server (NestJS)                         ║
║                                                            ║
║   📡 Server running on: http://localhost:${port}           ║
║   📚 Framework: NestJS (TypeScript)                       ║
║   🏗️  Architecture: Layered (Controller-Service-Repo)     ║
║                                                            ║
║   API Endpoints:                                           ║
║   - POST   /todos           Create Todo                    ║
║   - GET    /todos           Get all Todos                  ║
║   - GET    /todos/:id       Get Todo by ID                 ║
║   - PUT    /todos/:id       Update Todo (full)             ║
║   - PATCH  /todos/:id       Update Todo (partial)          ║
║   - DELETE /todos/:id       Delete Todo                    ║
║   - PATCH  /todos/:id/toggle Toggle Todo status            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
