import { db } from '../db/db';

export type ProfilePictureData = {
  id: number;
  imageUrl: string;
  isCurrent: boolean;
  createdAt: string;
};

export async function getUserProfilePictureService(userId: number): Promise<ProfilePictureData | null> {
  const result = await db.query<{
    id: number;
    image_url: string;
    is_current: boolean;
    created_at: string;
  }>(
    `
      SELECT id, image_url, is_current, created_at
      FROM profile_pictures
      WHERE user_id = $1 AND is_current = TRUE
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    imageUrl: row.image_url,
    isCurrent: row.is_current,
    createdAt: row.created_at,
  };
}
