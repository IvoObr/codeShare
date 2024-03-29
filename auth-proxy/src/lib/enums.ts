export enum Env {
    development = 'development',
    production = 'production'
}

export enum Headers {
    Authorization = 'authorization',
    ContentType = 'content-type',
}

export enum Collections {
    SNIPPETS = 'snippets',
    USERS = 'users',
}

export enum UserRole {
    Member = 'Member',
    Admin = 'Admin'
}

export enum UserStatus {
    Active = 'Active',
    NotActive = 'NotActive'
}

export enum Errors {
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    SSL_HANDSHAKE_FAILED = 'SSL_HANDSHAKE_FAILED',
}

export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    // PROXY_AUTHENTICATION_REQUIRED = 407, // todo: implement
    INTERNAL_SERVER_ERROR = 500,
    // NOT_IMPLEMENTED = 501,
    // BAD_GATEWAY = 502,
    // GATEWAY_TIMEOUT = 504,
    SSL_HANDSHAKE_FAILED = 525,
}
