export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'userId'>) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}

export interface Theme {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}
