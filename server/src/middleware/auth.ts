import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the structure of our JWT payload
// This interface represents what data we store in our tokens
interface JwtPayload {
  username: string;
}

// Extend the Express Request type to include our custom user property
// This allows us to add user information to the request object
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;  // Optional user property that contains the JWT payload
}

// Middleware function to authenticate incoming requests
// This function checks for a valid JWT token in the Authorization header
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Extract the Authorization header from the request
  const authHeader = req.headers['authorization'];
  // Get the token part from "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  
  // If no token is present, return 401 Unauthorized
  if (token == null) {
    res.sendStatus(401);
    return;
  }

  // Verify the token using our secret key
  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, user) => {
    // If there's an error (token is invalid or expired), return 403 Forbidden
    if (err) {
      res.sendStatus(403);
      return;
    }
    // If token is valid, attach the user data to the request object
    req.user = user as JwtPayload;
    // Continue to the next middleware/route handler
    next();
  });
};

// Function to generate a new access token
// Access tokens are short-lived (15 minutes) and used for regular API access
export const generateAccessToken = (username: string) => {
  return jwt.sign(
    { username },  // Payload containing user data
    process.env.JWT_SECRET_KEY as string,  // Secret key for signing
    { expiresIn: '15m' }  // Token expires in 15 minutes
  );
};

// Function to generate a new refresh token
// Refresh tokens are long-lived (7 days) and used to get new access tokens
export const generateRefreshToken = (username: string) => {
  return jwt.sign(
    { username },  // Payload containing user data
    process.env.JWT_SECRET_KEY as string,  // Secret key for signing
    { expiresIn: '7d' }  // Token expires in 7 days
  );
};

// Function to verify a refresh token
// Returns a Promise that resolves with the decoded token payload or rejects with an error
export const verifyRefreshToken = (refreshToken: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
      // If there's an error, reject the promise
      if (err) {
        reject(err);
        return;
      }
      // If token is valid, resolve with the decoded payload
      resolve(decoded as JwtPayload);
    });
  });
};



