export enum Env {
    development = 'development',
    production = 'production'
}

export enum Headers {
    Authorization = 'authorization'
}

export enum Collections {
    SNIPPETS = 'snippets',
    USERS = 'users',
}

export enum UserRole {
    Member = 'Member',
    Admin = 'Admin'
}

export enum Errors {
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
}

export enum StatusCodes {
    // OK = 200,
    // CREATED = 201,
    // NO_CONTENT = 204,
    // NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    // METHOD_NOT_ALLOWED = 405,
    // PROXY_AUTHENTICATION_REQUIRED = 407,
    // UNSUPPORTED_MEDIA_TYPE = 415,
    INTERNAL_SERVER_ERROR = 500,
    // NOT_IMPLEMENTED = 501,
    // BAD_GATEWAY = 502,
    // GATEWAY_TIMEOUT = 504,
}
