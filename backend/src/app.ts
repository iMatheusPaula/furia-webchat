import express from 'express';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import messageRoutes from './routes/message';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import {setupWebSocket} from "./socket";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(authRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

setupWebSocket(server);

server.listen(3000, () => {
    console.log('Servidor HTTP + WebSocket rodando em http://localhost:3000');
});
