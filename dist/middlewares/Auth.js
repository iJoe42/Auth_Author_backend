"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpExceptions_1 = require("../utils/HttpExceptions");
const JwtService_1 = require("../services/JwtService");
const dotenv_1 = __importDefault(require("dotenv"));
const permissions_1 = require("../config/permissions");
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
class Auth {
    constructor() { }
    // check Token, signed in || signed up
    verifyToken(req, _res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorization } = req.headers;
                if (!authorization)
                    throw new HttpExceptions_1.HttpException(401, "Unauthorized");
                const [type, token] = authorization.split(" ");
                if (type !== "Bearer")
                    throw new HttpExceptions_1.HttpException(401, "Unauthorized");
                const decoded = yield new JwtService_1.JwtService().verify(token, ACCESS_TOKEN_SECRET);
                req.user = decoded;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // check Roles
    verifyRoles(allowedRoles) {
        return (req, _res, next) => {
            var _a;
            // if no user or no roles
            if (!req.user || !((_a = req.user) === null || _a === void 0 ? void 0 : _a.roles))
                throw new HttpExceptions_1.HttpException(403, "Forbidden");
            // check if user's roles are allowed
            const hasRoles = req.user.roles.some((role) => allowedRoles.includes(role));
            if (!hasRoles)
                throw new HttpExceptions_1.HttpException(403, "Forbidden");
            next();
        };
    }
    // check Permissions
    verifyPermissions(permission) {
        return (req, _res, next) => {
            var _a;
            if (!req.user || !((_a = req.user) === null || _a === void 0 ? void 0 : _a.roles))
                throw new HttpExceptions_1.HttpException(403, "Forbidden");
            const userPermissions = (0, permissions_1.getPermissionsByRoles)(req.user.roles);
            if (!userPermissions || !userPermissions.includes(permission)) {
                throw new HttpExceptions_1.HttpException(403, `You are forbidden to ${permission}`);
            }
            next();
        };
    }
}
exports.default = Auth;
