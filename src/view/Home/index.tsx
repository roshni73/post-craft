import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/Button';
import Navbar from '@/Components/Navbar';
import { BookOpen, PenTool, Users, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
      <Navbar />
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 max-w-4xl mx-auto">Share Your Stories with the World</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern blog platform for writers and creators. Create, edit, and manage your posts
            with ease.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => (isAuthenticated ? navigate('/dashboard') : navigate('/login'))}
            >
              {isAuthenticated ? 'Create Post' : 'Start Writing'}
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 border-b">
        <h2 className="text-center mb-8">Why Choose BlogApp?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 text-center border">
            <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
              <PenTool className="size-6 text-primary" />
            </div>
            <h3 className="mb-2">Easy Writing</h3>
            <p className="text-muted-foreground">
              Create and edit posts with our simple, intuitive interface
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center border">
            <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="mb-2">Fast & Responsive</h3>
            <p className="text-muted-foreground">Lightning-fast performance on any device</p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center border">
            <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Users className="size-6 text-primary" />
            </div>
            <h3 className="mb-2">Organize Content</h3>
            <p className="text-muted-foreground">
              Categorize and tag your posts for easy discovery
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center border">
            <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
              <BookOpen className="size-6 text-primary" />
            </div>
            <h3 className="mb-2">Full Control</h3>
            <p className="text-muted-foreground">
              Complete CRUD operations for managing your content
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
