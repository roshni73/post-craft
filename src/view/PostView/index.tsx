import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/Components/Navbar';
import { Button } from '@/Components/Button';
import { useToast } from '@/Components/Toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/Alert-Dialog';
import { Skeleton } from '@/Components/Skeleton';
import { ArrowLeft, Calendar, User, Tag, Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';
import type { Post } from '@/types';
import { Breadcrumbs } from '@/Components/Breadcrumbs';

export default function PostView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, deletePost } = usePosts();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      const fetchedPost = await getPost(parseInt(id));
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        setError('Post not found');
      }
      setLoading(false);
    };

    loadPost();
  }, [id, getPost]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!post) return;
    try {
      await deletePost(post.id);
      addToast('Post deleted successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Failed to delete post', 'error');
    }
  };

  if (loading) {
    return <PostViewSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={[{ label: post.title }]} />

        <article className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {new Date(post.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {Math.ceil(post.body.length / 200)} min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white">
              {post.title}
            </h1>

            <div className="flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">
                    {user?.name || 'Anonymous Author'}
                  </p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/20 prose-blockquote:py-1 prose-blockquote:px-4
              prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Tag className="size-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Post?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base leading-relaxed">
              This action cannot be undone. This will permanently delete your post and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
            >
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PostViewSkeleton() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-12 w-3/4" />
            <div className="flex justify-between pb-6 border-b border-border">
              <div className="flex gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
