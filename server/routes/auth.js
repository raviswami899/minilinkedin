import { User } from '../models/User.js';
import { generateToken } from '../lib/auth.js';
import { mockDB } from '../lib/mockData.js';
import { isMongoDBConnected } from '../lib/database.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  bio: z.string().max(500).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    if (isMongoDBConnected()) {
      // Use MongoDB
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = new User(validatedData);
      await user.save();

      const token = generateToken(user._id.toString());
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        joinedAt: user.joinedAt
      };

      res.status(201).json({
        message: 'User created successfully',
        user: userResponse,
        token
      });
    } else {
      // Use mock database
      const existingUser = await mockDB.findUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await mockDB.createUser(validatedData);
      const token = generateToken(user.id);

      res.status(201).json({
        message: 'User created successfully',
        user,
        token
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    if (error instanceof Error && error.message.includes('E11000')) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    if (isMongoDBConnected()) {
      // Use MongoDB
      const user = await User.findOne({ email: validatedData.email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await user.comparePassword(validatedData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id.toString());
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        joinedAt: user.joinedAt
      };

      res.json({
        message: 'Login successful',
        user: userResponse,
        token
      });
    } else {
      // Use mock database
      const user = await mockDB.findUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await mockDB.comparePassword(user, validatedData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user.id);
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        joinedAt: user.joinedAt
      };

      res.json({
        message: 'Login successful',
        user: userResponse,
        token
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
