"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAsyncRoute = exports.createApiResponse = exports.calculateOffset = exports.createPaginationMeta = exports.formatName = exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const formatName = (firstName, lastName) => {
    return `${firstName} ${lastName}`.trim();
};
exports.formatName = formatName;
const createPaginationMeta = (page, limit, total) => ({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
});
exports.createPaginationMeta = createPaginationMeta;
const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};
exports.calculateOffset = calculateOffset;
const createApiResponse = (success, data, error, message) => ({
    success,
    data,
    error,
    message,
});
exports.createApiResponse = createApiResponse;
const handleAsyncRoute = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.handleAsyncRoute = handleAsyncRoute;
