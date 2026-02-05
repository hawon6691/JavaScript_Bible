/**
 * App Module (Root Module)
 *
 * 애플리케이션의 루트 모듈입니다.
 * 모든 기능 모듈들을 imports하여 애플리케이션을 구성합니다.
 *
 * NestJS는 모듈 시스템을 통해 애플리케이션을 구조화하며,
 * AppModule은 애플리케이션의 진입점 역할을 합니다.
 */

import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [TodosModule], // 기능 모듈들을 import
  controllers: [], // 앱 레벨 컨트롤러 (현재는 없음)
  providers: [], // 앱 레벨 프로바이더 (현재는 없음)
})
export class AppModule {}
