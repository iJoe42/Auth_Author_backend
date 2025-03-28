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
const AuthService_1 = __importDefault(require("../services/AuthService"));
const COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1000ms * 60s * 60m * 24h
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
};
const authService = new AuthService_1.default();
class AuthController {
    constructor() {
        this.authService = authService;
    }
    // login
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshToken } = yield this.authService.login(req.body);
                res
                    .cookie("jwt", refreshToken, COOKIE_OPTIONS)
                    .status(200)
                    .send({ accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // register
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken, refreshToken } = yield this.authService.register(req.body);
                res
                    .cookie("jwt", refreshToken, COOKIE_OPTIONS)
                    .status(201)
                    .send({ accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // refresh
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = yield this.authService.refresh(req.cookies.jwt);
                res.status(200).send({ accessToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // logout
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.jwt;
                if (!refreshToken) {
                    res.sendStatus(204);
                    return;
                }
                const user = yield this.authService.logout(refreshToken);
                if (user) {
                    res.clearCookie("jwt", COOKIE_OPTIONS).sendStatus(204);
                    return;
                }
                res.clearCookie("jwt", COOKIE_OPTIONS).sendStatus(204);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
