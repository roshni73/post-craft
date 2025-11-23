import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostForm } from './PostForm';

import { ArrowLeft, Moon, Sun, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useThemeStore } from '@/lib/store';
import type { Post } from '@/types';
import { Skeleton } from '@/Components/Skeleton';
import { Card, CardContent, CardHeader } from '@/Components/Card';
import { Button } from '@/Components/Button';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading, updatePost } = usePosts();
  const { mode, toggleTheme } = useThemeStore();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (posts.length > 0 && id) {
      const foundPost = posts.find((p) => p.id === parseInt(id));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPost(foundPost || null);
    }
  }, [posts, id]);

  const handleSubmit = async (postData: Omit<Post, 'id' | 'userId'>) => {
    if (!post) return;
    try {
      await updatePost(post.id, postData);
      toast.success('Post updated successfully!');
      navigate(`/post/${post.id}`);
    } catch (error) {
      toast.error('Failed to update post');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  if (loading && !post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <BookOpen className="size-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-4">
            The post you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <BookOpen className="size-6 text-primary-foreground" />
              </div>
              <div>
                <h2>Edit Post</h2>
                <p className="text-muted-foreground">Editing as {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <PostForm post={post} onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}
