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
const JwtService_1 = require("./JwtService");
const UserService_1 = __importDefault(require("./UserService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userService = new UserService_1.default();
const jwtService = new JwtService_1.JwtService();
class AuthService {
    constructor() {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    // login logic
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            // login by [phone] or [email]
            if (data.phone)
                user = yield this.userService.getByKey("phone", data.phone);
            else
                user = yield this.userService.getByKey("email", data.email);
            // if user not found or passwords don't match
            if (!user || !(yield bcrypt_1.default.compare(data.password, user.password))) {
                throw new HttpExceptions_1.HttpException(400, "Wrong credentials");
            }
            // login success, generate new access and refresh token for user
            const { email, roles } = user;
            const { accessToken, refreshToken } = this.jwtService.genAuthToken({ email, roles });
            yield this.userService.update(user.id, { refreshToken });
            return { accessToken, refreshToken };
        });
    }
    // register logic
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.userService.create(data);
            const { email, roles } = newUser;
            const { accessToken, refreshToken } = this.jwtService.genAuthToken({ email, roles });
            yield this.userService.update(newUser.id, { refreshToken });
            return { accessToken, refreshToken };
        });
    }
    // refresh
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getByKey("refreshToken", refreshToken);
            // user with this refreshToken not found
            if (!user)
                throw new HttpExceptions_1.HttpException(403, "Forbidden");
            const decoded = yield this.jwtService.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const isRoleMatch = user.roles.every((role) => decoded.roles.includes(role));
            if (decoded.email !== user.email || !isRoleMatch) {
                throw new HttpExceptions_1.HttpException(403, "Forbidden");
            }
            const { accessToken } = this.jwtService.genAuthToken({ email: user.email, roles: user.roles });
            return { accessToken };
        });
    }
    // logout
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getByKey("refreshToken", refreshToken);
            if (user)
                return yield this.userService.update(user.id, { refreshToken: "" });
        });
    }
}
exports.default = AuthService;
