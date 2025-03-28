import jwt, { JwtPayload } from "jsonwebtoken";
import { HttpException } from "../utils/HttpExceptions";
import dotenv from "dotenv";

dotenv.config();

export type AuthToken = {
    accessToken: string;
    refreshToken: string;
}

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = process.env as { [key: string]: string };

export class JwtService {

    genAuthToken(payload: object): AuthToken {
        const accessToken = this.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: Number(ACCESS_TOKEN_EXPIRY) });
        const refreshToken = this.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: Number(REFRESH_TOKEN_EXPIRY) });

        return { accessToken, refreshToken };
    }

    async verify(token: string, secret: string): Promise<jwt.JwtPayload> {
        const decoded: JwtPayload = await new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if(err) reject(new HttpException(403, "Forbidden"));
                else resolve(decoded as JwtPayload);
            });
        });

        return decoded;
    }

    sign(payload: object, secret: string, options?: jwt.SignOptions): string {
        return jwt.sign(payload, secret, options);
    }
}