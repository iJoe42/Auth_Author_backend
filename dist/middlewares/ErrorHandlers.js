"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpExceptions_1 = require("../utils/HttpExceptions");
const client_1 = require("@prisma/client");
const ErrorFactory = (err, res) => {
    if (err instanceof HttpExceptions_1.CustomError) {
        const { statusCode, stack, isLogging, errors } = err;
        if (isLogging) {
            const logMessage = JSON.stringify({ statusCode, errors, stack }, null, 2);
            console.log(logMessage);
        }
        return res.status(statusCode).send({ errors });
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        console.log(JSON.stringify(err, null, 2));
        return res.status(400).send({ errors: [{ message: "Bad Request" }] });
    }
    return null;
};
const ErrorHandler = (err, _req, res, _next) => {
    const handledError = ErrorFactory(err, res);
    if (!handledError) {
        console.log(JSON.stringify(`Unhandled error: ${err}`, null, 2));
        return void res.status(500).send({ errors: [{ message: "Internal server error" }] });
    }
};
exports.default = ErrorHandler;
