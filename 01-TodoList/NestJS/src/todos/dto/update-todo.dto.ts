/**
 * Update Todo DTO (Data Transfer Object)
 *
 * Todo 수정 시 클라이언트로부터 받는 데이터를 정의합니다.
 * PUT과 PATCH 모두에서 사용됩니다.
 */

import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  /**
   * 할 일 제목 (선택 사항 - PATCH의 경우)
   * - 1-100자
   */
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title must be 100 characters or less' })
  title?: string;

  /**
   * 할 일 설명 (선택 사항)
   * - 최대 500자
   */
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must be 500 characters or less' })
  description?: string;

  /**
   * 완료 여부 (선택 사항)
   */
  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed?: boolean;
}
