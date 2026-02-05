/**
 * Todos Module
 *
 * NestJS 모듈 시스템의 핵심입니다.
 * Todo 관련 모든 컴포넌트(Controller, Service, Repository)를 하나의 모듈로 묶습니다.
 *
 * 모듈은 NestJS 애플리케이션의 구성 단위이며,
 * 의존성 주입(DI)을 통해 컴포넌트 간의 결합도를 낮춥니다.
 */

import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosRepository } from './todos.repository';

@Module({
  controllers: [TodosController], // HTTP 요청을 처리하는 컨트롤러
  providers: [TodosService, TodosRepository], // 의존성 주입 가능한 프로바이더
  exports: [TodosService], // 다른 모듈에서 사용할 수 있도록 export (선택)
})
export class TodosModule {}
