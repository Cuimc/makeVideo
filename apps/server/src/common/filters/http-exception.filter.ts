import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { isApiResponse } from '@make-video/shared';
import { ERROR_CODES } from '../constants/error-codes';
import { createFailureResponse } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host
      .switchToHttp()
      .getResponse<{ status: (code: number) => { json: (body: unknown) => void } }>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (isApiResponse(exceptionResponse)) {
        response.status(status).json(exceptionResponse);
        return;
      }

      const message = this.resolveHttpExceptionMessage(exceptionResponse);
      response
        .status(status)
        .json(createFailureResponse(status, message ?? exception.message));
      return;
    }

    response
      .status(500)
      .json(
        createFailureResponse(
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          'Internal server error',
        ),
      );
  }

  private resolveHttpExceptionMessage(exceptionResponse: unknown) {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse !== 'object' || exceptionResponse === null) {
      return null;
    }

    const { message } = exceptionResponse as { message?: unknown };

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return typeof message === 'string' ? message : null;
  }
}
