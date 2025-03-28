"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpValidationException = exports.HttpException = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
class HttpException extends CustomError {
    constructor(statusCode = 500, message = "Something went wrong", isLogging = false) {
        super(message);
        this._statusCode = statusCode;
        this._isLogging = isLogging;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
    get errors() {
        return [this.message];
    }
    get statusCode() {
        return this._statusCode;
    }
    get isLogging() {
        return this._isLogging;
    }
}
exports.HttpException = HttpException;
class HttpValidationException extends CustomError {
    constructor(errors = ["Bad Request"], isLogging = false) {
        super("Bad Request");
        this._statusCode = 400;
        this._errors = errors;
        this._isLogging = isLogging;
        Object.setPrototypeOf(this, HttpValidationException.prototype);
    }
    get errors() {
        return this._errors;
    }
    get statusCode() {
        return this._statusCode;
    }
    get isLogging() {
        return this._isLogging;
    }
}
exports.HttpValidationException = HttpValidationException;
