import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, ThumbsUp, Share, Mail, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  joinedAt: string;
}

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    try {
      setCurrentUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
      return;
    }

    // Fetch user profile and posts
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const userResponse = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }

      // Fetch user's posts
      const postsResponse = await fetch(`/api/users/${userId}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">User not found</h3>
            <p className="text-muted-foreground">
              The user you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {currentUser?.id === user.id && (
                <Badge variant="secondary">Your Profile</Badge>
              )}
              
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}</span>
                </div>
              </div>
              
              {user.bio && (
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Posts Stats */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {posts.reduce((acc, post) => acc + (post.likes || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {posts.reduce((acc, post) => acc + (post.comments || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {currentUser?.id === user.id ? 'Your Posts' : `${user.name.split(' ')[0]}'s Posts`}
        </h2>
        
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                {currentUser?.id === user.id 
                  ? "You haven't shared anything yet. Start sharing your thoughts!"
                  : `${user.name.split(' ')[0]} hasn't shared anything yet.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="" alt={post.author.name} />
                    <AvatarFallback className="bg-secondary">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{post.author.name}</div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{post.content}</p>
              </CardContent>
              <CardContent className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.likes || 0}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments || 0}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Share className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
