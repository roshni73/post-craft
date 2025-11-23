import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './lib/store';
import { Home } from './view/Home';
import Register from './view/Register';
import { LoginPage } from './view/Login';
import { PrivateRoute } from './Components/PrivateRoute';
import Dashboard from './view/blog/Dashboard';
import { PostDetail } from './view/blog/PostDetail';
import { EditPostPage } from './view/blog/EditPostPage';
import { Toaster } from 'sonner';

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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditPostPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
