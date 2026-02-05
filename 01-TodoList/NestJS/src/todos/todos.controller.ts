/**
 * Todos Controller
 *
 * HTTP 요청 처리 계층 (Presentation Layer)
 * RESTful API 엔드포인트를 정의하고 HTTP 요청/응답을 처리합니다.
 *
 * API Specification.md에 정의된 7개 엔드포인트를 구현합니다:
 * - POST   /todos           - Todo 생성
 * - GET    /todos           - Todo 목록 조회
 * - GET    /todos/:id       - 특정 Todo 조회
 * - PUT    /todos/:id       - Todo 전체 수정
 * - PATCH  /todos/:id       - Todo 부분 수정
 * - DELETE /todos/:id       - Todo 삭제
 * - PATCH  /todos/:id/toggle - Todo 완료 상태 토글
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  /**
   * POST /todos
   * 새로운 Todo를 생성합니다.
   *
   * @param createTodoDto - 생성할 Todo 정보
   * @returns 201 Created - 생성된 Todo
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createTodoDto: CreateTodoDto,
  ) {
    const todo = this.todosService.create(createTodoDto);

    return {
      success: true,
      data: todo,
      message: 'Todo created successfully',
    };
  }

  /**
   * GET /todos
   * 모든 Todo 목록을 조회합니다.
   *
   * @returns 200 OK - Todo 배열
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    const todos = this.todosService.findAll();

    return {
      success: true,
      data: todos,
      message: todos.length > 0 ? 'Todos retrieved successfully' : 'No todos found',
      count: todos.length,
    };
  }

  /**
   * GET /todos/:id
   * 특정 Todo를 조회합니다.
   *
   * @param id - Todo ID (UUID v4)
   * @returns 200 OK - Todo
   * @throws 400 Bad Request - 잘못된 UUID 형식
   * @throws 404 Not Found - Todo를 찾을 수 없는 경우
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const todo = this.todosService.findOne(id);

    return {
      success: true,
      data: todo,
      message: 'Todo retrieved successfully',
    };
  }

  /**
   * PUT /todos/:id
   * Todo를 전체 수정합니다 (모든 필드 필수).
   *
   * @param id - Todo ID (UUID v4)
   * @param updateTodoDto - 수정할 Todo 정보 (모든 필드)
   * @returns 200 OK - 수정된 Todo
   * @throws 400 Bad Request - 잘못된 UUID 형식 또는 필수 필드 누락 시
   * @throws 404 Not Found - Todo를 찾을 수 없는 경우
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateTodoDto: UpdateTodoDto,
  ) {
    const todo = this.todosService.update(id, updateTodoDto);

    return {
      success: true,
      data: todo,
      message: 'Todo updated successfully',
    };
  }

  /**
   * PATCH /todos/:id
   * Todo를 부분 수정합니다 (제공된 필드만 수정).
   *
   * @param id - Todo ID (UUID v4)
   * @param updateTodoDto - 수정할 필드들
   * @returns 200 OK - 수정된 Todo
   * @throws 400 Bad Request - 잘못된 UUID 형식
   * @throws 404 Not Found - Todo를 찾을 수 없는 경우
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateTodoDto: UpdateTodoDto,
  ) {
    const todo = this.todosService.patch(id, updateTodoDto);

    return {
      success: true,
      data: todo,
      message: 'Todo updated successfully',
    };
  }

  /**
   * DELETE /todos/:id
   * Todo를 삭제합니다.
   *
   * @param id - Todo ID (UUID v4)
   * @returns 200 OK - 삭제된 Todo
   * @throws 400 Bad Request - 잘못된 UUID 형식
   * @throws 404 Not Found - Todo를 찾을 수 없는 경우
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const todo = this.todosService.remove(id);

    return {
      success: true,
      data: todo,
      message: 'Todo deleted successfully',
    };
  }

  /**
   * PATCH /todos/:id/toggle
   * Todo의 완료 상태를 토글합니다.
   *
   * @param id - Todo ID (UUID v4)
   * @returns 200 OK - 토글된 Todo
   * @throws 400 Bad Request - 잘못된 UUID 형식
   * @throws 404 Not Found - Todo를 찾을 수 없는 경우
   */
  @Patch(':id/toggle')
  @HttpCode(HttpStatus.OK)
  toggle(@Param('id', ParseUUIDPipe) id: string) {
    const todo = this.todosService.toggle(id);

    return {
      success: true,
      data: todo,
      message: 'Todo toggled successfully',
    };
  }
}
