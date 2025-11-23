import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge } from '@/Components/Badge';
import { Card, CardContent } from '@/Components/Card';
import { Skeleton } from '@/Components/Skeleton';
import { ArrowLeft, Calendar, Tag, Pencil, Trash2, Moon, Sun, BookOpen, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/Components/Alert-Dialog';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useThemeStore } from '@/lib/store';
import { Button } from '@/Components/Button';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { posts, loading, deletePost } = usePosts();
  const { mode, toggleTheme } = useThemeStore();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (posts.length > 0 && id) {
      const foundPost = posts.find((p) => p.id === parseInt(id));
      setPost(foundPost);
    }
  }, [posts, id]);

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post.id);
      toast.success('Post deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (loading && !post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <BookOpen className="size-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Button>

              {isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate('/register')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Post Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {post.category && (
                <Badge variant="secondary" className="mb-2">
                  {post.category}
                </Badge>
              )}
            </div>

            <h1 className="mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>Author</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="size-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{post.body}</p>
              </div>
            </CardContent>
          </Card>
          {isAuthenticated && (
            <div className="mt-8 flex items-center gap-3">
              <Button onClick={() => navigate(`/edit/${post.id}`)}>
                <Pencil className="size-4 mr-2" />
                Edit Post
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Trash2 className="size-4 mr-2 text-destructive" />
                    Delete Post
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
