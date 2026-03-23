import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// Extend the Express Request type to include the user object
export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];

  // Verify the JWT token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized user' });
  }

  // Attach the user to the request so the controller knows exactly who is making the request
  req.user = user;
  next();
};