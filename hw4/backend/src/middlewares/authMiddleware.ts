import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

export type AuthUser = {
  userId: number;
  username: string;
};

export type RequestWithAuth = Request & {
  authUser?: AuthUser;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.[config.auth.cookieName] as string | undefined;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized1' });
      return;
    }

    const decoded = jwt.verify(token, config.auth.jwtSecret) as JwtPayload & {
      userId?: number | string;
      username?: string;
      sub?: number | string;
    };

    const userIdClaim = decoded.userId ?? decoded.sub;
    const username = decoded.username;

    if (userIdClaim == null || !username) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    const userId = typeof userIdClaim === 'string' ? Number.parseInt(userIdClaim, 10) : userIdClaim;

    if (Number.isNaN(userId)) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    (req as RequestWithAuth).authUser = { userId, username };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized2' });
  }
}
