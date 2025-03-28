"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const ValidateRequest_1 = __importDefault(require("../middlewares/ValidateRequest"));
const UserValidations_1 = require("../validations/UserValidations");
const Auth_1 = __importDefault(require("../middlewares/Auth"));
const userController = new UserController_1.default();
const authMiddleware = new Auth_1.default();
const router = (0, express_1.Router)();
exports.UserRoutes = router;
router
    .get("/", userController.getAll.bind(userController))
    .get("/:id", userController.getById.bind(userController))
    .post("/", (0, ValidateRequest_1.default)(UserValidations_1.createUserSchema), userController.create.bind(userController))
    .patch("/:id", (0, ValidateRequest_1.default)(UserValidations_1.updateUserSchema), userController.update.bind(userController))
    .delete("/:id", authMiddleware.verifyPermissions("delete"), userController.delete.bind(userController));
