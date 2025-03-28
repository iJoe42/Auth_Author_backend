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
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const HttpExceptions_1 = require("../utils/HttpExceptions");
const userRepository = new UserRepository_1.default();
class UserService {
    constructor() {
        // Dependency Injection (DI)
        // Injecting "UserRepository" into "UserService"
        this.userRepository = userRepository;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getAll();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getById(id);
            if (!user)
                throw new HttpExceptions_1.HttpException(404, "User not found");
            return user;
        });
    }
    getByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getByKey(key, value);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            return yield this.userRepository.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getById(id);
            if (data.password) {
                data.password = yield bcrypt_1.default.hash(data.password, 10);
            }
            return this.userRepository.update(id, data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getById(id);
            return this.userRepository.delete(id);
        });
    }
}
exports.default = UserService;
