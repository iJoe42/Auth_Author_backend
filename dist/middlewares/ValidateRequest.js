"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const HttpExceptions_1 = require("../utils/HttpExceptions");
const ValidateRequest = (validationSchema) => {
    return (req, _res, next) => {
        try {
            validationSchema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((error) => `${error.path.join(".")} is ${error.message.toLowerCase()}`);
                next(new HttpExceptions_1.HttpValidationException(errorMessages));
            }
        }
    };
};
exports.default = ValidateRequest;
