/**
 * Todos Service
 *
 * 비즈니스 로직 계층 (Business Logic Layer)
 * Todo 관련 비즈니스 로직을 처리합니다.
 *
 * - Controller에서 받은 요청을 처리
 * - 입력값 추가 검증
 * - Repository를 통해 데이터 접근
 * - 에러 처리 및 예외 발생
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  /**
   * 모든 Todo 조회
   * @returns Todo 배열
   */
  findAll(): Todo[] {
    return this.todosRepository.findAll();
  }

  /**
   * ID로 특정 Todo 조회
   * @param id - Todo ID
   * @returns Todo
   * @throws NotFoundException - Todo를 찾을 수 없는 경우
   */
  findOne(id: string): Todo {
    const todo = this.todosRepository.findById(id);

    if (!todo) {
      throw new NotFoundException(`Todo not found with id: ${id}`);
    }

    return todo;
  }

  /**
   * 새로운 Todo 생성
   * @param createTodoDto - 생성할 Todo 정보
   * @returns 생성된 Todo
   * @throws BadRequestException - 검증 실패 시
   */
  create(createTodoDto: CreateTodoDto): Todo {
    const { title, description = '' } = createTodoDto;

    // 추가 검증: title이 공백만으로 이루어져 있는지 확인
    if (title.trim().length === 0) {
      throw new BadRequestException('Title cannot be empty');
    }

    return this.todosRepository.create(title.trim(), description.trim());
  }

  /**
   * Todo 전체 수정 (PUT)
   * @param id - Todo ID
   * @param updateTodoDto - 수정할 Todo 정보
   * @returns 수정된 Todo
   * @throws NotFoundException - Todo를 찾을 수 없는 경우
   * @throws BadRequestException - 필수 필드 누락 시
   */
  update(id: string, updateTodoDto: UpdateTodoDto): Todo {
    // PUT의 경우 모든 필드가 필요함
    const { title, description, completed } = updateTodoDto;

    if (title === undefined || description === undefined || completed === undefined) {
      throw new BadRequestException(
        'PUT requires all fields: title, description, completed',
      );
    }

    // title이 공백만으로 이루어져 있는지 확인
    if (title.trim().length === 0) {
      throw new BadRequestException('Title cannot be empty');
    }

    const updatedTodo = this.todosRepository.update(id, {
      title: title.trim(),
      description: description.trim(),
      completed,
    });

    if (!updatedTodo) {
      throw new NotFoundException(`Todo not found with id: ${id}`);
    }

    return updatedTodo;
  }

  /**
   * Todo 부분 수정 (PATCH)
   * @param id - Todo ID
   * @param updateTodoDto - 수정할 필드들
   * @returns 수정된 Todo
   * @throws NotFoundException - Todo를 찾을 수 없는 경우
   * @throws BadRequestException - title이 공백인 경우
   */
  patch(id: string, updateTodoDto: UpdateTodoDto): Todo {
    // PATCH의 경우 제공된 필드만 업데이트
    const updates: Partial<Pick<Todo, 'title' | 'description' | 'completed'>> =
      {};

    if (updateTodoDto.title !== undefined) {
      if (updateTodoDto.title.trim().length === 0) {
        throw new BadRequestException('Title cannot be empty');
      }
      updates.title = updateTodoDto.title.trim();
    }

    if (updateTodoDto.description !== undefined) {
      updates.description = updateTodoDto.description.trim();
    }

    if (updateTodoDto.completed !== undefined) {
      updates.completed = updateTodoDto.completed;
    }

    const updatedTodo = this.todosRepository.update(id, updates);

    if (!updatedTodo) {
      throw new NotFoundException(`Todo not found with id: ${id}`);
    }

    return updatedTodo;
  }

  /**
   * Todo 삭제
   * @param id - Todo ID
   * @returns 삭제된 Todo
   * @throws NotFoundException - Todo를 찾을 수 없는 경우
   */
  remove(id: string): Todo {
    const deletedTodo = this.todosRepository.delete(id);

    if (!deletedTodo) {
      throw new NotFoundException(`Todo not found with id: ${id}`);
    }

    return deletedTodo;
  }

  /**
   * Todo 완료 상태 토글
   * @param id - Todo ID
   * @returns 토글된 Todo
   * @throws NotFoundException - Todo를 찾을 수 없는 경우
   */
  toggle(id: string): Todo {
    const toggledTodo = this.todosRepository.toggle(id);

    if (!toggledTodo) {
      throw new NotFoundException(`Todo not found with id: ${id}`);
    }

    return toggledTodo;
  }
}
