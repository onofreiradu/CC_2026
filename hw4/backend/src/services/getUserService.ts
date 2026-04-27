import { db } from '../db/db';

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  birth_date: string | null;
  phone_number: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserService(userId: number): Promise<UserProfile | null> {
  const result = await db.query<UserProfile>(
    `
      SELECT id, username, email, full_name, birth_date, phone_number, profile_picture_url, created_at, updated_at
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0] ?? null;
}
