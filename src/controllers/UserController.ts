import type { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";

const userService = new UserService();

export default class UserController {
    private readonly userService: UserService;
    constructor() {
        this.userService = userService;
    }

    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.getAll();
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.getById(req.params.id);
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json({ user });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.update(req.params.id, req.body);
            res.status(201).json({ user })
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.userService.delete(req.params.id);
            res.sendStatus(204);
        } catch (error) {
           next(error); 
        }
    }
}