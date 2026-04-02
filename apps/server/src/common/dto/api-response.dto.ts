import type { ApiResponse } from '@make-video/shared';
import { ERROR_CODES } from '../constants/error-codes';

export class ApiResponseDto<T> implements ApiResponse<T> {
  constructor(
    public readonly data: T,
    public readonly code: number = ERROR_CODES.SUCCESS,
    public readonly message: string = 'ok',
  ) {}
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return new ApiResponseDto(data);
}

export function createFailureResponse(
  code: number,
  message: string,
): ApiResponse<null> {
  return new ApiResponseDto(null, code, message);
}
