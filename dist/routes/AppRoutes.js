"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const UserRoutes_1 = require("./UserRoutes");
const AuthRoutes_1 = require("./AuthRoutes");
const Auth_1 = __importDefault(require("../middlewares/Auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
exports.AppRoutes = router;
const authMiddleware = new Auth_1.default();
// "/users" preceded all "UserRoutes"
router.use("/users", authMiddleware.verifyToken, authMiddleware.verifyRoles([client_1.Role.MANAGER, client_1.Role.ADMIN]), UserRoutes_1.UserRoutes);
router.use("/auth", AuthRoutes_1.AuthRoutes);
