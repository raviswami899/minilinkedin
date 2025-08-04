import { Post } from '../models/Post.js';
import { mockDB } from '../lib/mockData.js';
import { isMongoDBConnected } from '../lib/database.js';
import { z } from 'zod';

const createPostSchema = z.object({
  content: z.string().min(1).max(2000)
});

export const getPosts = async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      // Use MongoDB
      const posts = await Post.find()
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .limit(50);

      const postsWithStats = posts.map(post => ({
        id: post._id,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likes: post.likes.length,
        comments: post.comments.length
      }));

      res.json({ posts: postsWithStats });
    } else {
      // Use mock database
      const posts = await mockDB.getAllPosts();
      res.json({ posts: posts.filter(post => post !== null) });
    }
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (isMongoDBConnected()) {
      // Use MongoDB
      const post = new Post({
        content: validatedData.content,
        author: req.user._id
      });

      await post.save();
      await post.populate('author', 'name email');

      const postResponse = {
        id: post._id,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likes: post.likes.length,
        comments: post.comments.length
      };

      res.status(201).json({
        message: 'Post created successfully',
        post: postResponse
      });
    } else {
      // Use mock database
      const post = await mockDB.createPost(req.user.id || req.user._id?.toString(), validatedData.content);
      
      if (!post) {
        return res.status(500).json({ message: 'Failed to create post' });
      }

      res.status(201).json({
        message: 'Post created successfully',
        post
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }

    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (isMongoDBConnected()) {
      // Use MongoDB
      const posts = await Post.find({ author: userId })
        .populate('author', 'name email')
        .sort({ createdAt: -1 });

      const postsWithStats = posts.map(post => ({
        id: post._id,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likes: post.likes.length,
        comments: post.comments.length
      }));

      res.json({ posts: postsWithStats });
    } else {
      // Use mock database
      const posts = await mockDB.getUserPosts(userId);
      res.json({ posts: posts.filter(post => post !== null) });
    }
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
