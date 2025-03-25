import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import { LoginResponse } from '../types/auth.js';

// Registration endpoint
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;
    console.log('Registration attempt for username:', username);
    console.log('Password length:', password.length);
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create user (password will be hashed by the model's beforeCreate hook)
    const user = await User.create({
      username,
      password,
    });

    console.log('User created successfully:', user.username);
    return res.status(201).json({ message: 'User created successfully', username: user.username });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response<LoginResponse>> => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    console.log('Provided password length:', password.length);
    
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('Found user:', user.username);
    console.log('Stored hash length:', user.password.length);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    console.log('Login successful for user:', username);
    // Return tokens
    return res.json({ username, accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const router = Router();

// POST /register - Register a new user
router.post('/register', register);

// POST /login - Login user
router.post('/login', login);

export default router;

