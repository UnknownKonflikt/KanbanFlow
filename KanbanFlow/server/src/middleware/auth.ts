import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header (assuming it's a Bearer token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  // If no token is provided, return 401 (Unauthorized)
  if (!token) {
    return res.sendStatus(401); // Return to ensure no further execution
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }

  // Now that we are sure token is a string, we can safely call jwt.verify
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Return 403 if token is invalid or expired
    }

    req.user = decoded as JwtPayload;
    return next(); // Proceed to the next middleware if the token is valid
  });
  return;
};
