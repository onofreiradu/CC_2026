import { db } from '../db/db';
import { uploadFileToAzure } from '../utils/azureUpload';
import { logUserAction } from '../utils/logger';

export async function uploadProfilePictureService(
  userId: number,
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string
): Promise<string> {
  // Upload to Azure Blob Storage
  const imageUrl = await uploadFileToAzure(fileBuffer, originalFileName, mimeType);

  // Set all previous pictures for this user to not current
  await db.query(
    'UPDATE profile_pictures SET is_current = FALSE WHERE user_id = $1',
    [userId]
  );

  // Insert new profile picture
  await db.query(
    `
      INSERT INTO profile_pictures (user_id, image_url, is_current)
      VALUES ($1, $2, TRUE)
    `,
    [userId, imageUrl]
  );

  // Update user's profile_picture_url
  await db.query(
    'UPDATE users SET profile_picture_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [imageUrl, userId]
  );

  return imageUrl;
}
