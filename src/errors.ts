// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

export class ClientError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ClientError.prototype)
  }
}

export class BadRequestError extends ClientError {
  statusCode = 400

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

export class UnauthorizedError extends ClientError {
  statusCode = 401

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends ClientError {
  statusCode = 403

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class NotFoundError extends ClientError {
  statusCode = 404

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class MethodNotAllowedError extends ClientError {
  statusCode = 405

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, MethodNotAllowedError.prototype)
  }
}

export class NotAcceptableError extends ClientError {
  statusCode = 406

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, NotAcceptableError.prototype)
  }
}

export class PreconditionFailedError extends ClientError {
  statusCode = 412

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, PreconditionFailedError.prototype)
  }
}

export class UnsupportedMediaTypeError extends ClientError {
  statusCode = 415

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, UnsupportedMediaTypeError.prototype)
  }
}

export class ServerError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ServerError.prototype)
  }
}

export class InternalServerError extends ServerError {
  statusCode = 500

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}

export class NotImplementedError extends ServerError {
  statusCode = 501

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, NotImplementedError.prototype)
  }
}
