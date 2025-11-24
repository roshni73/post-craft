import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useDebounce } from '@/hooks/useDebounce';
import Navbar from '@/Components/Navbar';
import { Button } from '@/Components/Button';
import { Input } from '@/Components/Input';
import { useToast } from '@/Components/Toast';
import { EmptyState } from '@/Components/EmptyState';
import { PostSkeleton } from '@/Components/PostSkeleton';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

const POSTS_PER_PAGE = 6;
const categories = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, loading, error, fetchPosts, deletePost } = usePosts();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        debouncedSearchQuery === '' ||
        post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, debouncedSearchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchParams({});
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (
      window.confirm('Are you sure you want to delete this post? This action cannot be undone.')
    ) {
      try {
        await deletePost(id);
        addToast('Post deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete post', 'error');
      }
    }
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All';

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Stories</h1>
            <p className="text-muted-foreground text-lg">
              Manage and create content for your readers.
            </p>
          </div>
          <Button
            onClick={() => navigate('/posts/create')}
            className="rounded-full px-6 h-11 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="size-5 mr-2" />
            New Story
          </Button>
        </div>
        <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 border-b border-border/40">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFilters}
                className="shrink-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                title="Clear filters"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/5 border border-destructive/10 p-8 text-center max-w-md mx-auto">
            <p className="text-destructive font-medium mb-2">Unable to load posts</p>
            <p className="text-sm text-destructive/80 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => fetchPosts()}
              className="border-destructive/20 hover:bg-destructive/10"
            >
              Try Again
            </Button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={hasActiveFilters ? 'No matches found' : 'Start your writing journey'}
            description={
              hasActiveFilters
                ? "We couldn't find any stories matching your criteria. Try different keywords."
                : 'Create your first story to share your ideas with the world.'
            }
            action={
              hasActiveFilters
                ? {
                    label: 'Clear Filters',
                    onClick: handleClearFilters,
                  }
                : {
                    label: 'Create Story',
                    onClick: () => navigate('/posts/create'),
                  }
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group relative flex flex-col h-full bg-card hover:bg-muted/20 rounded-2xl p-6 transition-all duration-300 border border-transparent hover:border-border/50 cursor-pointer"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                      {post.category || 'Uncategorized'}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                    {post.body.replace(/<[^>]*>/g, '')}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Calendar className="size-3.5" />
                      {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>

                    <div
                      className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/posts/${post.id}/edit`);
                        }}
                        title="Edit"
                      >
                        <Edit className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => handleDelete(e, post.id)}
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8 border-t border-border/30">
                <Button
                  variant="ghost"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full hover:bg-transparent hover:text-primary disabled:opacity-30"
                >
                  <ChevronLeft className="size-5 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-foreground">{currentPage}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{totalPages}</span>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full hover:bg-transparent hover:text-primary disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="size-5 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
