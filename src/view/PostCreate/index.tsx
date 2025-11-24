import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import Navbar from '@/Components/Navbar';
import { Label } from '@/Components/Label';
import { Input } from '@/Components/Input';
import { Button } from '@/Components/Button';
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/Components/RichTextEditor/Lazy';
import { useToast } from '@/Components/Toast';
import { Breadcrumbs } from '@/Components/Breadcrumbs';

const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'];

export default function PostCreate() {
  const navigate = useNavigate();
  const { addPost, loading } = usePosts();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');

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

      await addPost({
        title: title.trim(),
        body: body.trim(),
        category,
        tags: tagsArray,
      });

      addToast('Post created successfully!', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to create post', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Breadcrumbs items={[{ label: 'Create Post' }]} />

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Create New Story</h1>
          <p className="text-muted-foreground text-lg">Share your thoughts with the world.</p>
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
                      Publishing...
                    </>
                  ) : (
                    'Publish Story'
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
