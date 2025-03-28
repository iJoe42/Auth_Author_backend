import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export async function connectToDB() {
    try {
        await db.$connect();
        console.log("[database]: successfully connected to the database!");
    } catch (error) {
        console.log("[database]: connection error: ", error);
        await db.$disconnect();
    }
}