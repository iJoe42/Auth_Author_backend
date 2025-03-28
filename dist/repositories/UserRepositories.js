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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
class UserRepository {
    constructor() {
        this.db = db_1.db;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.user.findMany();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.user.findUnique({
                where: { id }
            });
        });
    }
    getByKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.user.findFirst({
                where: {
                    [key]: value
                }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.user.create({
                data
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.user.update({
                where: { id },
                data: data
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.user.delete({
                where: { id }
            });
        });
    }
}
exports.default = UserRepository;
