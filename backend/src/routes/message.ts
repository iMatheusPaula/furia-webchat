import {Router, Request, Response} from 'express';
import {authenticate} from "../middlewares/auth";
import cookieParser from 'cookie-parser';
import {sendMessage} from "../services/messageService";

const router = Router();
router.use(cookieParser());

router.post('/', authenticate, async (req: Request, res: Response): Promise<any> => {
    const userId = req.cookies.userId;
    const {content, chatId} = req.body;

    const message = sendMessage(chatId, userId, content);

    res.json(message);
});

export default router;
