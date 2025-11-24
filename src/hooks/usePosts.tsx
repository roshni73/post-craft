import type { Post, PostsState } from '@/types';
import { create } from 'zustand';

const API_BASE = 'https://jsonplaceholder.typicode.com';

export const usePosts = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();

      const enhancedPosts = data.slice(0, 20).map((post: Post, index: number) => ({
        ...post,
        category: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'][index % 5],
        tags: [
          ['react', 'javascript'],
          ['lifestyle', 'tips'],
          ['adventure', 'travel'],
          ['recipes', 'cooking'],
          ['wellness', 'fitness'],
        ][index % 5],
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      }));

      set({ posts: enhancedPosts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  addPost: async (post: Omit<Post, 'id' | 'userId'>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, userId: 1 }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      const newPost = await response.json();

      // Add client-side enhancements
      const enhancedPost = {
        ...newPost,
        category: post.category || 'Technology',
        tags: post.tags || [],
        createdAt: new Date().toISOString(),
      };

      set({
        posts: [enhancedPost, ...get().posts],
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
      throw error;
    }
  },

  updatePost: async (id: number, post: Partial<Post>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (!response.ok) throw new Error('Failed to update post');
      const updatedPost = await response.json();

      set({
        posts: get().posts.map((p) => (p.id === id ? { ...p, ...updatedPost, ...post } : p)),
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
      throw error;
    }
  },

  deletePost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      set({
        posts: get().posts.filter((p) => p.id !== id),
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
      throw error;
    }
  },

  getPost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      // First check if we have the post in state
      const existingPost = get().posts.find((p) => p.id === id);
      if (existingPost) {
        set({ loading: false });
        return existingPost;
      }

      // If not, fetch from API
      const response = await fetch(`${API_BASE}/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();

      // Enhance with mock data
      const enhancedPost = {
        ...data,
        category: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health'][id % 5],
        tags: [
          ['react', 'javascript'],
          ['lifestyle', 'tips'],
          ['adventure', 'travel'],
          ['recipes', 'cooking'],
          ['wellness', 'fitness'],
        ][id % 5],
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      };

      set({ loading: false });
      return enhancedPost;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
      return null;
    }
  },
}));
