import {Router, Request, Response} from 'express';
import {PrismaClient} from "../generated/prisma";
import {authenticate} from "../middlewares/auth";
import cookieParser from 'cookie-parser';

const router = Router();
router.use(cookieParser());
const prisma = new PrismaClient();

router.post('/', authenticate, async (req: Request, res: Response): Promise<any> => {
    const userId = req.cookies.userId;
    const {content, chatId} = req.body;

    const message = await prisma.message.create({
        data: {
            content,
            userId,
            chatId,
        },
    });

    res.json(message);
});

export default router;
