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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const ErrorHandlers_1 = __importDefault(require("./middlewares/ErrorHandlers"));
const HttpExceptions_1 = require("./utils/HttpExceptions");
const AppRoutes_1 = require("./routes/AppRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api", AppRoutes_1.AppRoutes);
// Handle not existing routes
app.use((_req, _res, next) => {
    next(new HttpExceptions_1.HttpException(404, "Route not found"));
});
// Error handling
app.use(ErrorHandlers_1.default);
// app init function
const port = process.env.PORT || 3001;
const initializeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(port, () => {
            console.log(`[server]: server is running at http://localhost:${port}/api`);
        });
        yield (0, db_1.connectToDB)();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
// call the app init function
initializeApp();
