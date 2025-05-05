import {Server} from 'socket.io';
import {sendMessage} from "../services/messageService";
import http from "http";

export function setupWebSocket(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        },
    });

    io.on('connection', (socket): void => {
        console.log(`Usuário conectado: ${socket.id}`);

        socket.on('joinChat', (chatId: string) => {
            socket.join(chatId);
            console.log(`Usuário entrou na sala ${chatId}`);
        });

        socket.on('leaveChat', (chatId: string) => {
            socket.leave(chatId);
            console.log(`Usuário saiu da sala ${chatId}`);
        });

        socket.on('sendMessage', async (data) => {
            const {content, chatId, userId} = data;

            try {
                const message = await sendMessage(chatId, userId, content);
                console.log(message)
                io.to(data.chatId).emit('newMessage', message);
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Usuário desconectado: ${socket.id}`);
        });
    });

    return io;
}
