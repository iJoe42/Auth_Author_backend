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
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpExceptions_1 = require("../utils/HttpExceptions");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = process.env;
class JwtService {
    genAuthToken(payload) {
        const accessToken = this.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: Number(ACCESS_TOKEN_EXPIRY) });
        const refreshToken = this.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: Number(REFRESH_TOKEN_EXPIRY) });
        return { accessToken, refreshToken };
    }
    verify(token, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
                    if (err)
                        reject(new HttpExceptions_1.HttpException(403, "Forbidden"));
                    else
                        resolve(decoded);
                });
            });
            return decoded;
        });
    }
    sign(payload, secret, options) {
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
}
exports.JwtService = JwtService;
