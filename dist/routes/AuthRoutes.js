"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const ValidateRequest_1 = __importDefault(require("../middlewares/ValidateRequest"));
const UserValidations_1 = require("../validations/UserValidations");
const router = (0, express_1.Router)();
exports.AuthRoutes = router;
const authController = new AuthController_1.default();
router
    .post("/login", (0, ValidateRequest_1.default)(UserValidations_1.loginUserSchema), authController.login.bind(authController))
    .post("/register", (0, ValidateRequest_1.default)(UserValidations_1.registerUserSchema), authController.register.bind(authController))
    .post("/refresh", authController.refresh.bind(authController))
    .post("/logout", authController.logout.bind(authController));
