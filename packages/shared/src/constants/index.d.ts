export declare const API_ENDPOINTS: {
    readonly USERS: "/api/users";
    readonly AUTH: "/api/auth";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const USER_ROLES: {
    readonly ADMIN: "admin";
    readonly MODERATOR: "moderator";
    readonly USER: "user";
};
export declare const PAGINATION_DEFAULTS: {
    readonly PAGE: 1;
    readonly LIMIT: 10;
    readonly MAX_LIMIT: 100;
};
