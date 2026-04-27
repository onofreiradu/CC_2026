import { Response } from 'express';
import { RequestWithAuth } from '../middlewares/authMiddleware';
import { getUserService } from '../services/getUserService';
import { logUserAction } from '../utils/logger';

export async function getUserController(req: RequestWithAuth, res: Response): Promise<void> {
  const authUser = req.authUser;

  if (!authUser) {
    await logUserAction('Unauthorized user profile retrieval attempt', { userId: null });
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await getUserService(authUser.userId);

  if (!user) {
    await logUserAction('User profile not found', { userId: authUser.userId });
    res.status(404).json({ error: 'User not found' });
    return;
  }

  await logUserAction('User profile retrieved', { userId: authUser.userId });
  res.status(200).json(user);
}
