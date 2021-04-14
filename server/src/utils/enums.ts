export enum UserRole {
  Member = 'Member',
  Admin = 'Admin'
}

export enum Collections {
  SNIPPETS = "snippets",
  USERS = "users",
}

export enum Env {
  development = 'development',
  production = 'production'
}

export enum Headers {
  Authorization = 'authorization'
}

export enum Errors {
/* User Errors */
FORBIDDEN = "FORBIDDEN",
USER_EXISTS = "USER_EXISTS",
UNAUTHORIZED = "UNAUTHORIZED",
LOGIN_FAILED = "LOGIN_FAILED",
INVALID_NAME = "INVALID_NAME",
INVALID_EMAIL = "INVALID_EMAIL",
INVALID_PASSWORD = "INVALID_PASSWORD",
PASSWORD_CRITERIA_NOT_MET = "PASSWORD_CRITERIA_NOT_MET",
COULD_NOT_DELETE_USER_BY_ID = "COULD_NOT_DELETE_USER_BY_ID",
COULD_NOT_INSERT_TOKEN_IN_DB = "COULD_NOT_INSERT_TOKEN_IN_DB",
  /* General Errors */
MISSING_PARAMETER = "MISSING_PARAMETER",
}

export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  UNSUPPORTED_MEDIA_TYPE = 415,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  GATEWAY_TIMEOUT = 504,
}