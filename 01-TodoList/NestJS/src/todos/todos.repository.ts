/**
 * Todos Repository
 *
 * 데이터 접근 계층 (Data Access Layer)
 * Repository Pattern을 구현하여 데이터 저장소와의 상호작용을 추상화합니다.
 *
 * 현재는 메모리 기반 저장소를 사용하지만,
 * 향후 파일 시스템이나 데이터베이스로 쉽게 교체 가능합니다.
 */

import { Injectable } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodosRepository {
  /**
   * 메모리 기반 저장소
   * 실제 프로덕션에서는 데이터베이스를 사용합니다.
   */
  private todos: Todo[] = [];

  /**
   * 모든 Todo 조회
   * @returns 생성 시간 기준 최신순으로 정렬된 Todo 배열
   */
  findAll(): Todo[] {
    // createdAt 기준 최신순 정렬
    return this.todos.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * ID로 특정 Todo 조회
   * @param id - Todo ID (UUID)
   * @returns Todo 또는 undefined
   */
  findById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  /**
   * 새로운 Todo 생성
   * @param title - 할 일 제목
   * @param description - 할 일 설명 (선택)
   * @returns 생성된 Todo
   */
  create(title: string, description: string = ''): Todo {
    const now = new Date().toISOString();

    const newTodo = new Todo({
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    this.todos.push(newTodo);
    return newTodo;
  }

  /**
   * Todo 수정
   * @param id - Todo ID
   * @param updates - 수정할 필드들
   * @returns 수정된 Todo 또는 undefined
   */
  update(
    id: string,
    updates: Partial<Pick<Todo, 'title' | 'description' | 'completed'>>,
  ): Todo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return undefined;
    }

    // 기존 Todo를 가져와서 수정
    const existingTodo = this.todos[todoIndex];
    const updatedTodo = new Todo({
      ...existingTodo,
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  /**
   * Todo 삭제
   * @param id - Todo ID
   * @returns 삭제된 Todo 또는 undefined
   */
  delete(id: string): Todo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return undefined;
    }

    const deletedTodo = this.todos[todoIndex];
    this.todos.splice(todoIndex, 1);
    return deletedTodo;
  }

  /**
   * Todo 완료 상태 토글
   * @param id - Todo ID
   * @returns 토글된 Todo 또는 undefined
   */
  toggle(id: string): Todo | undefined {
    const todo = this.findById(id);

    if (!todo) {
      return undefined;
    }

    return this.update(id, { completed: !todo.completed });
  }

  /**
   * 모든 Todo 삭제 (테스트용)
   */
  clear(): void {
    this.todos = [];
  }

  /**
   * Todo 개수 조회
   * @returns 전체 Todo 개수
   */
  count(): number {
    return this.todos.length;
  }
}
