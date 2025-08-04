import { User } from '../models/User.js';
import { mockDB } from '../lib/mockData.js';
import { isMongoDBConnected } from '../lib/database.js';

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (isMongoDBConnected()) {
      // Use MongoDB
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        joinedAt: user.joinedAt
      };

      res.json({ user: userResponse });
    } else {
      // Use mock database
      const user = await mockDB.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      // Use MongoDB
      const users = await User.find().select('-password').sort({ joinedAt: -1 }).limit(50);
      
      const usersResponse = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        joinedAt: user.joinedAt
      }));

      res.json({ users: usersResponse });
    } else {
      // Use mock database - for simplicity, return empty array for now
      // In a real implementation, you'd want to track all users
      res.json({ users: [] });
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
