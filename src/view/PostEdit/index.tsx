import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import Navbar from '@/Components/Navbar';
import { Card, CardContent } from '@/Components/Card';
import { Label } from '@/Components/Label';
import { Input } from '@/Components/Input';
import { Button } from '@/Components/Button';
import { Loader2, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/Components/RichTextEditor/Lazy';
import { useToast } from '@/Components/Toast';
import { Breadcrumbs } from '@/Components/Breadcrumbs';

const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'];

export default function PostEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { posts, updatePost, deletePost, loading } = usePosts();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');
  const [postLoading, setPostLoading] = useState(true);

  useEffect(() => {
    const post = posts.find((p) => p.id === Number(id));
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setCategory(post.category || 'Technology');
      setTags(post.tags?.join(', ') || '');
      setPostLoading(false);
    } else if (posts.length > 0) {
      addToast('Post not found', 'error');
      setPostLoading(false);
    }
  }, [id, posts, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      addToast('Title is required', 'error');
      return;
    }

    if (title.length < 3) {
      addToast('Title must be at least 3 characters', 'error');
      return;
    }

    if (title.length > 200) {
      addToast('Title must be less than 200 characters', 'error');
      return;
    }

    if (!body.trim()) {
      addToast('Content is required', 'error');
      return;
    }

    if (body.length < 10) {
      addToast('Content must be at least 10 characters', 'error');
      return;
    }

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await updatePost(Number(id), {
        title: title.trim(),
        body: body.trim(),
        category,
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

  const handleDelete = async () => {
    if (
      window.confirm('Are you sure you want to delete this post? This action cannot be undone.')
    ) {
      try {
        await deletePost(Number(id));
        addToast('Post deleted successfully', 'success');
        navigate('/dashboard');
      } catch (err) {
        addToast('Failed to delete post', 'error');
      }
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

  if (!title && !postLoading) {
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
        <Breadcrumbs items={[{ label: title || 'Edit Post' }]} />

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Edit Story</h1>
            <p className="text-muted-foreground text-lg">Refine your content.</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4 mr-2" />
            Delete Story
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12 text-lg bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary/20 transition-all"
                />
                <p className="text-xs text-muted-foreground text-right">{title.length}/200</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-base font-medium">
                  Content
                </Label>
                <div className="rounded-lg border border-border/40 overflow-hidden bg-background shadow-sm">
                  <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Write your story here..."
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">{body.length} chars</p>
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-medium">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="react, web..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={loading}
                    className="bg-background"
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
    </div>
  );
}
