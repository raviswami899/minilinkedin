import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageSquare, ThumbsUp, Share, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
      return;
    }

    // Fetch posts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create post');
      }
    } catch (error) {
      setError('An error occurred while creating the post');
    } finally {
      setPosting(false);
    }
  };

  const getInitials = (name) => {
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

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Create Post */}
      {/* {user && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">Share your thoughts</p>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleCreatePost}>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                disabled={!newPost.trim() || posting}
                className="ml-auto"
              >
                {posting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )} */}
      {user && (
  <Card className="shadow-sm border rounded-2xl overflow-hidden">
  <CardHeader className="flex flex-row items-center gap-4 p-6 bg-muted/30">
    <Avatar className="h-8 w-8">
      <AvatarImage src="" alt={user.name} />
      <AvatarFallback className="bg-primary text-white rounded-xl">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
    <div>
      <h3 className="text-lg font-semibold leading-none">{user.name}</h3>
      <p className="text-sm text-muted-foreground">What would you like to share today?</p>
    </div>
  </CardHeader>

  <form onSubmit={handleCreatePost}>
    <CardContent className="p-6 pt-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Textarea
        placeholder="Write a post..."
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        rows={4}
        className="resize-none bg-muted/10 p-4 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </CardContent>

    <CardFooter className="flex justify-end p-6 pt-2">
      <Button
        type="submit"
        disabled={!newPost.trim() || posting}
        className="flex items-center gap-2 px-6 py-2 rounded-md shadow-sm"
      >
        {posting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Post
          </>
        )}
      </Button>
    </CardFooter>
  </form>
</Card>
)}


      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to share something with the community!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={post.author.name} />
                    <AvatarFallback className="bg-primary text-white rounded-xl">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link 
                      to={`/profile/${post.author.id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {post.author.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{post.content}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4 border-t">
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
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
