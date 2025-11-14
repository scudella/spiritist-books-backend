import { StatusCodes } from 'http-status-codes';

export class CustomAPIError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);

    Object.setPrototypeOf(this, CustomAPIError.prototype);

    this.statusCode = statusCode;
  }
}
