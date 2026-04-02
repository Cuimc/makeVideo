import { HttpException, HttpStatus } from '@nestjs/common';
import { createFailureResponse } from '../dto/api-response.dto';

export class BusinessException extends HttpException {
  constructor(
    code: number,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(createFailureResponse(code, message), status);
  }
}
