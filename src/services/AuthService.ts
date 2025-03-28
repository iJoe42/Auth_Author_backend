import { Role } from "@prisma/client";
import { HttpException } from "../utils/HttpExceptions";
import type { LoginUserInput, RegisterUserInput } from "../validations/UserValidations";
import { type AuthToken, JwtService } from "./JwtService";
import UserService from "./UserService";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


const userService = new UserService();
const jwtService = new JwtService();

export default class AuthService {

    private readonly userService: UserService;
    private readonly jwtService: JwtService;
    constructor() {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // login logic
    async login(data: LoginUserInput): Promise<AuthToken> {
        let user;

        // login by [phone] or [email]
        if(data.phone) user = await this.userService.getByKey("phone", data.phone);
        else user = await this.userService.getByKey("email", data.email);

        // if user not found or passwords don't match
        if(!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new HttpException(400, "Wrong credentials");
        }

        // login success, generate new access and refresh token for user
        const { email, roles } = user;
        const { accessToken, refreshToken } = this.jwtService.genAuthToken({ email, roles });
        await this.userService.update(user.id, { refreshToken });

        return { accessToken, refreshToken };
    }

    // register logic
    async register(data: RegisterUserInput): Promise<AuthToken> {
        const newUser = await this.userService.create(data);
        const { email, roles } = newUser;
        const { accessToken, refreshToken } = this.jwtService.genAuthToken({ email, roles });
        await this.userService.update(newUser.id, { refreshToken });

        return { accessToken, refreshToken };
    }

    // refresh
    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const user = await this.userService.getByKey("refreshToken", refreshToken);

        // user with this refreshToken not found
        if(!user) throw new HttpException(403, "Forbidden");

        const decoded = await this.jwtService.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        );

        const isRoleMatch = user.roles.every((role: Role) => decoded.roles.includes(role));

        if(decoded.email !== user.email || !isRoleMatch) {
            throw new HttpException(403, "Forbidden");
        }

        const { accessToken } = this.jwtService.genAuthToken({ email: user.email, roles: user.roles });
        return { accessToken };
    }

    // logout
    async logout(refreshToken: string) {
        const user = await this.userService.getByKey("refreshToken", refreshToken);
        if(user) return await this.userService.update(user.id, { refreshToken: "" });
    }
}