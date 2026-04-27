import { db } from '../db/db';
import { verifyPassword } from '../utils/hashPassword';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export async function loginService(email: string, password: string): Promise<string> {
  const result = await db.query<{ id: number; username: string; email: string; password: string }>(
    'SELECT id, username, email, password FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  if (!verifyPassword(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const expiresIn = config.auth.jwtExpiresIn as SignOptions['expiresIn'];

  

  return jwt.sign(
    {
      sub: user.id,
      userId: user.id,
      username: user.username,
      email: user.email,
    },
    config.auth.jwtSecret,
    { expiresIn }
  );
}

export default loginService;