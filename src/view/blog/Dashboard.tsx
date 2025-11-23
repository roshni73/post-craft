import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { useThemeStore } from '../../lib/store';
import { PostCard } from './PostCard';
import { PostForm } from './PostForm';
import { LogOut, Plus, Search, Moon, Sun, BookOpen, Filter } from 'lucide-react';

import { toast } from 'sonner';
import type { Post } from '@/types';
import { Button } from '@/Components/Button';
import { Input } from '@/Components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/Select';
import { Alert, AlertDescription } from '@/Components/Alert';
import { Card, CardContent, CardHeader } from '@/Components/Card';
import { Skeleton } from '@/Components/Skeleton';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { posts, loading, error, fetchPosts, addPost, updatePost, deletePost } = usePosts();
  const { mode, toggleTheme } = useThemeStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleViewPost = (post: Post) => {
    navigate(`/post/${post.id}`);
  };

  const handleSubmitPost = async (postData: Omit<Post, 'id' | 'userId'>) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
        toast.success('Post updated successfully!');
      } else {
        await addPost(postData);
        toast.success('Post created successfully!');
      }
      setShowForm(false);
      setEditingPost(null);
    } catch (error) {
      toast.error('Failed to save post');
      throw error;
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

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
                <h1>Blog Platform</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <div className="max-w-3xl mx-auto">
            <PostForm post={editingPost} onSubmit={handleSubmitPost} onCancel={handleCancelForm} />
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <Filter className="size-4 text-muted-foreground" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
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

                <Button onClick={handleAddPost}>
                  <Plus className="size-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {loading && posts.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!loading && paginatedPosts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onView={handleViewPost}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
            {!loading && paginatedPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || categoryFilter !== 'All'
                    ? 'Try adjusting your filters'
                    : 'Start by creating your first blog post'}
                </p>
                {!searchQuery && categoryFilter === 'All' && (
                  <Button onClick={handleAddPost}>
                    <Plus className="size-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
