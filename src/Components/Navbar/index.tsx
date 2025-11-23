import { useNavigate } from 'react-router-dom';
import { BookOpen, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../lib/store';
import { Button } from '../Button';

export default function Navbar() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeStore();

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-primary rounded-full p-2">
            <BookOpen className="size-6 text-primary-foreground" />
          </div>
          <span className="font-semibold">PostCraft</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
