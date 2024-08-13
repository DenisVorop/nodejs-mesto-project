export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 403;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
