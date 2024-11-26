import { HttpException, HttpStatus } from '@nestjs/common';

export interface ICustomExpcetion {
  message?: string;
  status: HttpStatus;
  action?: string;
  error_code?: string;
  error_location_code?: string;
  error_description?: string;
  details?: object[];
  timestamp?: number;
  data?: any;
}

export class CustomException extends HttpException {
  constructor({ ...error }: ICustomExpcetion) {
    super(
      {
        message: error.message,
        details: error.details,
        error_code: error.error_code,
        data: error.data,
        action: error.action,
        error_location_code: error.error_location_code,
        error_description: error.error_description,
        // timestamp: new Date().getTime(),
        status: error.status,
      },
      error.status,
    );
  }
}
