/**
 * Todo Entity
 *
 * Todo 데이터 모델을 정의합니다.
 * ERD.md에 정의된 스키마와 일치합니다.
 */

export class Todo {
  /**
   * 고유 식별자 (UUID v4)
   */
  id: string;

  /**
   * 할 일 제목 (1-100자)
   */
  title: string;

  /**
   * 할 일 상세 설명 (최대 500자, 선택 사항)
   */
  description: string;

  /**
   * 완료 여부
   */
  completed: boolean;

  /**
   * 생성 시각 (ISO 8601 형식)
   */
  createdAt: string;

  /**
   * 최종 수정 시각 (ISO 8601 형식)
   */
  updatedAt: string;

  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}
