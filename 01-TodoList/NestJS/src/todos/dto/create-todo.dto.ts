/**
 * Create Todo DTO (Data Transfer Object)
 *
 * Todo 생성 시 클라이언트로부터 받는 데이터를 정의합니다.
 * class-validator를 사용하여 자동 검증을 수행합니다.
 */

import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTodoDto {
  /**
   * 할 일 제목
   * - 필수 항목
   * - 1-100자
   * - 공백 자동 제거
   */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title must be 100 characters or less' })
  title: string;

  /**
   * 할 일 설명
   * - 선택 항목
   * - 최대 500자
   * - 공백 자동 제거
   */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must be 500 characters or less' })
  description?: string;
}
