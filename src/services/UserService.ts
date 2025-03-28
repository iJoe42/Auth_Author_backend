import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import { HttpException } from "../utils/HttpExceptions";

import type { CreateUserInput, UpdateUserInput } from "../validations/UserValidations";

const userRepository = new UserRepository();

export default class UserService {

    private userRepository: UserRepository;
    constructor() {
        // Dependency Injection (DI)
        // Injecting "UserRepository" into "UserService"
        this.userRepository = userRepository;
    }

    async getAll() {
        return await this.userRepository.getAll();
    }

    async getById(id: string) {
        const user = await this.userRepository.getById(id);
        if(!user) throw new HttpException(404, "User not found");
        return user;
    }

    async getByKey(key: keyof Prisma.UserWhereInput, value: Prisma.UserWhereInput[typeof key]) {
        return await this.userRepository.getByKey(key, value);
    }

    async create(data: CreateUserInput) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await this.userRepository.create({
            ...data,
            password: hashedPassword
        });
    }

    async update(id: string, data: UpdateUserInput) {
        await this.getById(id);
        if(data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return this.userRepository.update(id, data);
    }

    async delete(id: string) {
        await this.getById(id);
        return this.userRepository.delete(id);
    }
}