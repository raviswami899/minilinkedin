import bcrypt from 'bcryptjs';

class MockDatabase {
  constructor() {
    this.users = [];
    this.posts = [];
    this.nextUserId = 1;
    this.nextPostId = 1;
  }

  async init() {
    // Create some demo users
    const demoPassword = await bcrypt.hash('password123', 12);
    
    this.users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: demoPassword,
        bio: 'Software developer passionate about building great products.',
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: demoPassword,
        bio: 'Product manager who loves connecting with talented professionals.',
        joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ];

    this.posts = [
      {
        id: '1',
        content: 'Excited to share that I just completed a new React project! Building user interfaces has never been more fun. 🚀',
        authorId: '1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: ['2'],
        comments: []
      },
      {
        id: '2',
        content: 'Just had an amazing team meeting discussing our product roadmap. Collaboration is key to building great products! 💡',
        authorId: '2',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        likes: ['1'],
        comments: []
      },
      {
        id: '3',
        content: 'Pro tip: Always write clean, readable code. Your future self (and your teammates) will thank you! 🎯',
        authorId: '1',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        likes: ['2'],
        comments: []
      }
    ];

    this.nextUserId = 3;
    this.nextPostId = 4;
  }

  // User methods
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = {
      id: this.nextUserId.toString(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      bio: userData.bio,
      joinedAt: new Date()
    };
    
    this.users.push(user);
    this.nextUserId++;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      joinedAt: user.joinedAt
    };
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id) {
    const user = this.users.find(user => user.id === id);
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      joinedAt: user.joinedAt
    };
  }

  async comparePassword(user, candidatePassword) {
    return bcrypt.compare(candidatePassword, user.password);
  }

  // Post methods
  async createPost(authorId, content) {
    const post = {
      id: this.nextPostId.toString(),
      content,
      authorId,
      createdAt: new Date(),
      likes: [],
      comments: []
    };
    
    this.posts.unshift(post); // Add to beginning
    this.nextPostId++;
    
    return this.getPostWithAuthor(post.id);
  }

  async getAllPosts() {
    return Promise.all(
      this.posts.map(post => this.getPostWithAuthor(post.id))
    );
  }

  async getUserPosts(userId) {
    const userPosts = this.posts.filter(post => post.authorId === userId);
    return Promise.all(
      userPosts.map(post => this.getPostWithAuthor(post.id))
    );
  }

  async getPostWithAuthor(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;
    
    const author = await this.findUserById(post.authorId);
    if (!author) return null;
    
    return {
      id: post.id,
      content: post.content,
      author: {
        id: author.id,
        name: author.name,
        email: author.email
      },
      createdAt: post.createdAt,
      likes: post.likes.length,
      comments: post.comments.length
    };
  }
}

export const mockDB = new MockDatabase();
