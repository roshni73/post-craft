import { useState, useEffect } from 'react';

import { Loader2 } from 'lucide-react';
import type { Post } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Card';
import { Alert, AlertDescription } from '@/Components/Alert';
import { Label } from '@/Components/Label';
import { Input } from '@/Components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/Select';
import { Button } from '@/Components/Button';
import { Textarea } from '@/Components/Textarea';

interface PostFormProps {
  post?: Post | null;
  onSubmit: (post: Omit<Post, 'id' | 'userId'>) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'];

export function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setCategory(post.category || 'Technology');
      setTags(post.tags?.join(', ') || '');
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (!body.trim()) {
      setError('Content is required');
      return;
    }

    if (body.trim().length < 20) {
      setError('Content must be at least 20 characters');
      return;
    }

    setLoading(true);

    try {
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        category,
        tags: tagArray,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="react, javascript, web development (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">Separate tags with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Content *</Label>
            <Textarea
              id="body"
              placeholder="Write your post content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
              required
              rows={10}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">{body.length} characters (minimum 20)</p>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {post ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{post ? 'Update Post' : 'Create Post'}</>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
