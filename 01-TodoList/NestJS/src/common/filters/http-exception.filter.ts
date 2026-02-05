/**
 * HTTP Exception Filter
 *
 * 모든 HTTP 예외를 일관된 형식으로 응답하는 전역 필터입니다.
 *
 * NestJS의 예외 처리를 커스터마이징하여
 * API-Specification.md에 정의된 에러 응답 형식을 유지합니다.
 *
 * 에러 응답 형식:
 * {
 *   success: false,
 *   error: {
 *     code: "ERROR_CODE",
 *     message: "Error message"
 *   }
 * }
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HttpException 여부 확인
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : { message: 'Internal server error' };

    // NestJS의 기본 에러 응답 구조
    const errorResponse =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as any);

    // 에러 코드 매핑
    const errorCode = this.getErrorCode(status, errorResponse);

    // 에러 메시지 추출
    const errorMessage = this.getErrorMessage(errorResponse);

    // validation details 추출 (error.details 또는 details)
    const details = errorResponse.error?.details || errorResponse.details;

    // API 명세에 맞는 응답 형식
    const responseBody = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 에러 로깅
    this.logger.error(
      `[${errorCode}] ${errorMessage} - ${request.method} ${request.url}`,
      isHttpException ? undefined : (exception as Error).stack,
    );

    response.status(status).json(responseBody);
  }

  /**
   * HTTP 상태 코드에 따른 에러 코드 반환
   */
  private getErrorCode(status: number, errorResponse: any): string {
    // 이미 에러 응답에 code가 있으면 그대로 사용
    if (errorResponse.error?.code) {
      return errorResponse.error.code;
    }

    // HTTP 상태 코드에 따른 기본 에러 코드
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'VALIDATION_ERROR';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.METHOD_NOT_ALLOWED:
        return 'METHOD_NOT_ALLOWED';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_ERROR';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  /**
   * 에러 응답에서 메시지 추출
   */
  private getErrorMessage(errorResponse: any): string {
    // 이미 에러 응답에 message가 있으면 그대로 사용
    if (errorResponse.error?.message) {
      return errorResponse.error.message;
    }

    // NestJS 기본 에러 메시지
    if (errorResponse.message) {
      // 배열인 경우 첫 번째 메시지 사용
      if (Array.isArray(errorResponse.message)) {
        return errorResponse.message[0];
      }
      return errorResponse.message;
    }

    return 'An error occurred';
  }
}
