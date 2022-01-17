export enum UserRole {
  Member = 'Member',
  Admin = 'Admin'
}

export enum UserStatus {
  Active = 'Active',
  NotActive = 'NotActive'
}

export enum Collections {
  SNIPPETS = 'snippets',
  USERS = 'users',
}

export enum Events {
  messageError = 'messageError',
  messageSuccess = 'messageSuccess'
} 

export enum Env {
  development = 'development',
  production = 'production'
}

export enum Headers {
  Authorization = 'authorization'
}

export enum Errors {
 // StatusCode Errors handled by ServerError()
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
 // User Errors
  USER_EXISTS = 'USER_EXISTS',
  INVALID_NAME = 'INVALID_NAME',
  INVALID_ROLE = 'INVALID_ROLE',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT_FAILED = 'LOGOUT_FAILED',
  INVALID_EMAIL = 'INVALID_EMAIL',
  COULD_NOT_LOGIN = 'COULD_NOT_LOGIN',
  COULD_NOT_LOGOUT = 'COULD_NOT_LOGOUT',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  COULD_NOT_SEND_EMAIL = 'COULD_NOT_SEND_EMAIL',
  PASSWORD_CRITERIA_NOT_MET = 'PASSWORD_CRITERIA_NOT_MET',
  COULD_NOT_DELETE_USER_BY_ID = 'COULD_NOT_DELETE_USER_BY_ID',
  COULD_NOT_INSERT_TOKEN_IN_DB = 'COULD_NOT_INSERT_TOKEN_IN_DB',
 // General Errors
  MISSING_PARAMETER = 'MISSING_PARAMETER',
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