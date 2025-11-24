import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/Button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="text-9xl font-bold text-primary/20">404</div>
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="size-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
