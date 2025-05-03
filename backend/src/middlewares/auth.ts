import {Request, Response, NextFunction} from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.cookies.userId;
  if (!userId) {
    res.status(401).json({error: 'Acesso não autorizado'});
    return;
  }
  // Se o usuário estiver autenticado, prossegue
  next();
};
