import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './lib/store';
import { ToastProvider, ToastContainer } from './Components/Toast';
import { Home } from './view/Home';
import Register from './view/Register';
import { LoginPage } from './view/Login';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { NotFound } from './view/NotFound';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import("./view/Dashboard"));
const PostCreate = lazy(() => import("./view/PostCreate"));
const PostEdit = lazy(() => import("./view/PostEdit"));
const PostView = lazy(() => import("./view/PostView"));


function App() {
  const { mode } = useThemeStore();

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ToastProvider>
      <Router>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/create"
              element={
                <ProtectedRoute>
                  <PostCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <PostEdit />
                </ProtectedRoute>
              }
            />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </Router>
    </ToastProvider>
  );
}

export default App;
