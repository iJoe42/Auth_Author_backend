"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
/* US Phone Number
const phoneRegex = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
*/
const phoneRegexTH = new RegExp(/^[0]([0-9]{9})$/);
exports.createUserSchema = zod_1.z.object({
    fname: zod_1.z.string().min(1, { message: "Must contain at least 1 character" }),
    lname: zod_1.z.string().min(1, { message: "Must contain at least 1 character" }),
    phone: zod_1.z.string().regex(phoneRegexTH, { message: "Must be a valid TH phone number" }),
    email: zod_1.z.string().email({ message: "Must be a valid email address" }),
    password: zod_1.z.string().min(6, { message: "Must be at least 6 characters long" }),
    roles: zod_1.z.array(zod_1.z.enum([client_1.Role.ADMIN, client_1.Role.MANAGER, client_1.Role.USER])).optional(),
    refreshToken: zod_1.z.string().optional(),
});
exports.updateUserSchema = exports.createUserSchema.partial();
exports.registerUserSchema = exports.createUserSchema.omit({
    roles: true,
    refreshToken: true,
});
exports.loginUserSchema = exports.registerUserSchema.omit({
    fname: true,
    lname: true,
}).extend({
    phone: zod_1.z.string().regex(phoneRegexTH, { message: "Must be a valid TH phone number" }).optional(),
    email: zod_1.z.string().email({ message: "Must be a valid email address" }).optional(),
});
