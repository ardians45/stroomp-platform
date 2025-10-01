import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { User } from '@stroomp/shared-types';

interface AuthRequest extends Request {
  user?: User;
}

// Secret key for JWT (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// In-memory storage for demonstration (would use database in production)
const users: User[] = [];

// Function to verify Solana wallet signature
const verifyWalletSignature = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> => {
  // This would contain the actual verification logic
  // For now we'll return true as a placeholder
  return true;
};

// Create a user if doesn't exist
const createUser = (walletAddress: string): User => {
  const existingUser = users.find(u => u.wallet === walletAddress);
  if (existingUser) {
    return existingUser;
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    wallet: walletAddress,
    createdAt: new Date(),
  };
  
  users.push(newUser);
  return newUser;
};

// Generate JWT token
const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, wallet: user.wallet },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware to authenticate token
const authenticateToken = (req: AuthRequest, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    
    // Find user in our "database" based on wallet
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(403).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    next();
  });
};

// Route to authenticate wallet signature and return JWT
const authenticateWallet = async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and message are required'
      });
    }

    // Verify the wallet signature (this would be the actual verification)
    const isValidSignature = await verifyWalletSignature(walletAddress, signature, message);
    
    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet signature'
      });
    }

    // Create or retrieve user
    const user = createUser(walletAddress);
    
    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          wallet: user.wallet,
          username: user.username || null,
          createdAt: user.createdAt
        }
      },
      message: 'Authentication successful'
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Route to get user profile
const getUserProfile = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: req.user,
    message: 'User profile retrieved'
  });
};

export { authenticateToken, authenticateWallet, getUserProfile, AuthRequest };