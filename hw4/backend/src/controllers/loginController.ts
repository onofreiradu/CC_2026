import { Request, Response } from 'express';
import loginService from '../services/loginService';
import { config } from '../config';
import { logUserAction } from '../utils/logger';

export async function loginController(req: Request, res: Response): Promise<void> {
  let email = "";
  let password = "";
  try {
    ({ email, password } = req.body as { email: string; password: string });

    if (!email || !password) {
      await logUserAction('Failed login attempt', { email: email ?? null });
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const token = await loginService(email, password);
    res.cookie(config.auth.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: config.auth.cookieSameSite,
      maxAge: config.auth.cookieMaxAgeMs,
      path: '/',
    });
    await logUserAction('Login successful', { email });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {

    await logUserAction('Login failed', { email: email ?? null, error: (error as Error).message });

    res.status(401).json({ error: 'Invalid credentials' });
  }
}

export function logoutController(req: Request, res: Response): void {
  res.clearCookie(config.auth.cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: config.auth.cookieSameSite,
    path: '/',
  });
  
  res.status(200).json({ message: 'Logout successful' });
}
