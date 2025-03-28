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
exports.connectToDB = exports.db = void 0;
const client_1 = require("@prisma/client");
exports.db = new client_1.PrismaClient();
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.db.$connect();
            console.log("[database]: successfully connected to the database!");
        }
        catch (error) {
            console.log("[database]: connection error: ", error);
            yield exports.db.$disconnect();
        }
    });
}
exports.connectToDB = connectToDB;
