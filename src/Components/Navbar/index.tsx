import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/lib/store';
import { Moon, Sun, LogOut, PenSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
            >
              <div className="bg-black dark:bg-white p-1 rounded">
                <PenSquare className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-black dark:text-white font-bold text-xl">PostCraft</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="border"
                  size="icon"
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  aria-label="Toggle theme"
                >
                  {mode === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-400" />
                  )}
                </Button>

                <Button
                  variant="border"
                  size="icon"
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  aria-label="Toggle theme"
                >
                  {mode === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-400" />
                  )}
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
