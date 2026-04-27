import { Response } from 'express';
import { getUserProfilePictureService } from '../services/getProfilePictureService';
import { RequestWithAuth } from '../middlewares/authMiddleware';
import { logUserAction } from '../utils/logger';

export async function getProfilePictureController(req: RequestWithAuth, res: Response): Promise<void> {
  const userId = req.authUser?.userId;

  if (!userId || Number.isNaN(userId)) {
    await logUserAction('Invalid profile picture retrieval attempt', { userId: userId ?? null });
    res.status(400).json({ error: 'Invalid or missing user ID' });
    return;
  }

  const profilePicture = await getUserProfilePictureService(userId);

  if (!profilePicture) {
    await logUserAction('Profile picture not found', { userId, imageUrl: null });
    res.status(404).json({ error: 'No profile picture found' });
    return;
  }

  await logUserAction('Profile picture retrieved', { userId, imageUrl: profilePicture });
  res.status(200).json(profilePicture);
}
