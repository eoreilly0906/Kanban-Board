import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import { LoginResponse } from '../types/auth.js';

export const login = async (req: Request, res: Response): Promise<Response<LoginResponse>> => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    // Return tokens
    return res.json({ username, accessToken, refreshToken });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;

