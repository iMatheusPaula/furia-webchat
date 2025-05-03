import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {PrismaClient} from "../generated/prisma";
import {authenticate} from "../middlewares/auth";
import cookieParser from 'cookie-parser';

const router = Router();
router.use(cookieParser());
const prisma = new PrismaClient();

router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const {name, email, password} = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({error: 'Email e senha são obrigatórios'});
  }

  try {
    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser) {
      return res.status(400).json({error: 'Email já está em uso'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const {password: _, ...userWithoutPassword} = user;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({error: 'Erro ao registrar usuário'});
  }
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({error: 'Email e senha são obrigatórios'});
  }

  try {
    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
      return res.status(400).json({error: 'Email ou senha inválidos'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return res.status(400).json({error: 'Email ou senha inválidos'});
    }

    // Criação de cookie de sessão com o ID do usuário
    res.cookie('userId', user.id, {
      httpOnly: true, // O cookie só pode ser acessado via HTTP
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // Ativar somente em produção
      maxAge: 3600 * 1000 * 1000, // Expiração do cookie: 1 dia
    });

    res.json({message: 'Login bem-sucedido'});
  } catch (error) {
    res.status(500).json({error: 'Erro no login', body: error});
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('userId'); // Limpa o cookie de sessão
  res.json({message: 'Logout bem-sucedido'});
});

router.get('/me', authenticate, async (req: Request, res: Response) : Promise<any> => {
  const userId = req.cookies.userId;
  const user = await prisma.user.findUnique({where: {id: userId}});

  if (!user) {
    return res.status(404).json({error: 'Usuário não encontrado'});
  }

  res.json({message: 'Acesso autorizado', body: user});
});

export default router;
