import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import Navbar from '@/Components/Navbar';
import { Card, CardContent } from '@/Components/Card';
import { Label } from '@/Components/Label';
import { Input } from '@/Components/Input';
import { Button } from '@/Components/Button';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { RichTextEditor } from '@/Components/RichTextEditor/Lazy';
import { useToast } from '@/Components/Toast';
import { Breadcrumbs } from '@/Components/Breadcrumbs';
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'];

const postSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  body: yup
    .string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  category: yup.string().required('Category is required'),
  tags: yup.string().optional().default(''),
});

type PostEditFormData = yup.InferType<typeof postSchema>;

export default function PostEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { posts, updatePost, deletePost, loading } = usePosts();
  const { addToast } = useToast();
  const [postLoading, setPostLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostEditFormData>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: '',
      body: '',
      category: 'Technology',
      tags: '',
    },
  });

  const titleValue = watch('title');
  const bodyValue = watch('body');

  useEffect(() => {
    const post = posts.find((p) => p.id === Number(id));
    if (post) {
      reset({
        title: post.title,
        body: post.body,
        category: post.category || 'Technology',
        tags: post.tags?.join(', ') || '',
      });
      setPostLoading(false);
    } else if (posts.length > 0) {
      addToast('Post not found', 'error');
      setPostLoading(false);
    }
  }, [id, posts, addToast, reset]);

  const onSubmit = async (data: PostEditFormData) => {
    try {
      const tagsArray = data.tags
        ? data.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
        : [];

      await updatePost(Number(id), {
        title: data.title.trim(),
        body: data.body.trim(),
        category: data.category,
        tags: tagsArray,
      });

      addToast('Post updated successfully!', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update post', 'error');
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(Number(id));
      addToast('Post deleted successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Failed to delete post', 'error');
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!titleValue && !postLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive text-center mb-4">Post not found</p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Breadcrumbs items={[{ label: titleValue || 'Edit Post' }]} />

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Edit Story</h1>
            <p className="text-muted-foreground text-lg">Refine your content.</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleDeleteClick}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4 mr-2" />
            Delete Story
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter a captivating title..."
                  disabled={loading}
                  className={`h-12 text-lg bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary/20 transition-all ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">
                  {titleValue?.length || 0}/200
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-base font-medium">
                  Content
                </Label>
                <div
                  className={`rounded-lg border overflow-hidden bg-background shadow-sm ${errors.body ? 'border-red-500' : 'border-border/40'}`}
                >
                  <Controller
                    name="body"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Write your story here..."
                        disabled={loading}
                      />
                    )}
                  />
                </div>
                {errors.body && <p className="text-sm text-red-600 mt-1">{errors.body.message}</p>}
                <p className="text-xs text-muted-foreground text-right">
                  {bodyValue?.length || 0} chars
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-muted/20 border border-border/40 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-medium">
                    Category
                  </Label>
                  <select
                    id="category"
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('category')}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="react, web..."
                    disabled={loading}
                    className="bg-background"
                    {...register('tags')}
                  />
                  <p className="text-xs text-muted-foreground">Comma separated</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  className="w-full rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>

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
