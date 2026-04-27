import { Request, Response } from 'express';
import { RequestWithAuth } from '../middlewares/authMiddleware';
import { logUserAction } from '../utils/logger';

export async function meController(req: Request, res: Response): Promise<void> {
  const authUser = (req as RequestWithAuth).authUser;

  if (!authUser) {
    await logUserAction('Unauthorized profile access attempt', { userId: null });
    res.status(401).json({ error: 'Unauthorized3' });
    return;
  }

  await logUserAction('Profile accessed', { userId: authUser.userId });
  res.status(200).json({ userId: authUser.userId, username: authUser.username });
}
