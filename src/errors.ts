// Client Errors

export class BadRequestError extends Error {
  statusCode = 400
}

export class UnauthorizedError extends Error {
  statusCode = 401
}

export class ForbiddenError extends Error {
  statusCode = 403
}

export class NotFoundError extends Error {
  statusCode = 404
}

export class MethodNotAllowedError extends Error {
  statusCode = 405
}

export class NotAcceptableError extends Error {
  statusCode = 406
}

export class PreconditionFailedError extends Error {
  statusCode = 412
}

export class UnsupportedMediaTypeError extends Error {
  statusCode = 415
}

// Server Errors

export class InternalServerError extends Error {
  statusCode = 500
}

export class NotImplementedError extends Error {
  statusCode = 501
}
