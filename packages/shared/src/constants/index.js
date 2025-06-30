"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION_DEFAULTS = exports.USER_ROLES = exports.HTTP_STATUS = exports.API_ENDPOINTS = void 0;
exports.API_ENDPOINTS = {
    USERS: '/api/users',
    AUTH: '/api/auth',
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
exports.USER_ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
};
exports.PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
};
