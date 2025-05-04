import {Router, Request, Response} from 'express';
import {PrismaClient} from "../generated/prisma";
import {authenticate} from "../middlewares/auth";
import cookieParser from 'cookie-parser';

const router = Router();
router.use(cookieParser());
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response): Promise<any> => {
    const {name, date, time} = req.body;
    const chat = await prisma.chat.create({
        data: {
            name,
            date: new Date(date),
            time: parseInt(time),
            isActive: true,
        },
    });
    res.json(chat);
});

router.get('/', authenticate, async (req: Request, res: Response): Promise<any> => {
    const chats = await prisma.chat.findMany();
    res.json(chats);
});

router.get('/:id', authenticate, async (req: Request, res: Response): Promise<any> => {
    const {id} = req.params;
    const chat = await prisma.chat.findUnique({
        where: {
            id: id,
        },
    });
    if (!chat) {
        return res.status(404).json({error: 'Chat not found'});
    }
    res.json(chat);
});

router.put('/:id', authenticate, async (req: Request, res: Response): Promise<any> => {
    const {id} = req.params;
    const {name, date, time} = req.body;
    const chat = await prisma.chat.update({
        where: {
            id: id,
        },
        data: {
            name,
            date: new Date(date),
            time: parseInt(time),
        },
    });
    res.json(chat);
});

router.post('/:chatId/join', authenticate, async (req: Request, res: Response): Promise<any> => {
    const userId: string = req.cookies.userId;
    const {chatId} = req.params;

    try {
        const join = await prisma.chatUser.create({
            data: {
                chatId: chatId,
                userId: userId,
            },
        });
        res.json(join);
    } catch (err) {
        res.status(400).json({
            error: 'Usuário já está no chat ou dados inválidos',
            body: err
        });
    }
});

export default router;
