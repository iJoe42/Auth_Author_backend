import { Request, Response, NextFunction } from "express"
import { type z, ZodError } from "zod";
import { HttpValidationException } from "../utils/HttpExceptions";

const ValidateRequest = (validationSchema: z.Schema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            validationSchema.parse(req.body);
            next();
        } catch (error) {
            if(error instanceof ZodError) {
                const errorMessages = error.errors.map(
                    (error) => `${error.path.join(".")} is ${error.message.toLowerCase()}`
                );
                next(new HttpValidationException(errorMessages));
            }
        }
    };
};

export default ValidateRequest;