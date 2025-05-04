import express from 'express';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import messageRoutes from './routes/message';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(authRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
