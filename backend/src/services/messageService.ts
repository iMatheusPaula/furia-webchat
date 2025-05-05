import {PrismaClient} from "../generated/prisma";

const prisma = new PrismaClient();

export async function sendMessage(chatId: string, userId: string, content: string) {
    return prisma.message.create({
        data: {
            content,
            userId,
            chatId,
        },
    });
}