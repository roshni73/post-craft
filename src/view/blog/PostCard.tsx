import { Pencil, Trash2, Calendar, Tag, Eye } from 'lucide-react';

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
import type { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/Card';
import { Button } from '@/Components/Button';
import { Badge } from '@/Components/Badge';

interface PostCardProps {
  post: Post;
  onView?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function PostCard({ post, onView, onEdit, onDelete, showActions = true }: PostCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-2">{post.title}</h3>
            {post.category && (
              <Badge variant="secondary" className="mb-2">
                {post.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.body}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Tag className="size-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" />
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(post)}>
                <Eye className="size-4 mr-2" />
                View
              </Button>
            )}

            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                <Pencil className="size-4 mr-2" />
                Edit
              </Button>
            )}

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="size-4 text-destructive" />
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
                      onClick={() => onDelete(post.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
