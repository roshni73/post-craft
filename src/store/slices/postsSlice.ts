import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Post } from '@/types';

const API_BASE = 'https://jsonplaceholder.typicode.com';

interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
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

    return enhancedPosts;
});

export const addPost = createAsyncThunk(
    'posts/addPost',
    async (post: Omit<Post, 'id' | 'userId'>) => {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...post, userId: 1 }),
        });

        if (!response.ok) throw new Error('Failed to create post');
        const newPost = await response.json();

        return {
            ...newPost,
            category: post.category || 'Technology',
            tags: post.tags || [],
            createdAt: new Date().toISOString(),
        };
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, post }: { id: number; post: Partial<Post> }) => {
        const response = await fetch(`${API_BASE}/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });

        if (!response.ok) throw new Error('Failed to update post');

        return { id, post };
    }
);

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete post');

    return id;
});

export const getPost = createAsyncThunk('posts/getPost', async (id: number, { getState }) => {
    const state = getState() as { posts: PostsState };
    const existingPost = state.posts.posts.find((p) => p.id === id);

    if (existingPost) {
        return existingPost;
    }

    const response = await fetch(`${API_BASE}/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    const data = await response.json();

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

    return enhancedPost;
});

// Slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.error = action.error.message || 'An error occurred';
                state.loading = false;
            })

            // Add Post
            .addCase(addPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];
                state.loading = false;
            })
            .addCase(addPost.rejected, (state, action) => {
                state.error = action.error.message || 'An error occurred';
                state.loading = false;
            })

            // Update Post - Optimistic
            .addCase(updatePost.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Optimistic update
                const { id, post } = action.meta.arg;
                state.posts = state.posts.map((p) => (p.id === id ? { ...p, ...post } : p));
            })
            .addCase(updatePost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.error = action.error.message || 'An error occurred';
                state.loading = false;
                // Note: In a real app, you'd want to revert the optimistic update here
            })

            // Delete Post - Optimistic
            .addCase(deletePost.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Optimistic delete
                state.posts = state.posts.filter((p) => p.id !== action.meta.arg);
            })
            .addCase(deletePost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.error = action.error.message || 'An error occurred';
                state.loading = false;
                // Note: In a real app, you'd want to revert the optimistic delete here
            })

            // Get Post
            .addCase(getPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.loading = false;
                // Add to posts if not already there
                if (!state.posts.find((p) => p.id === action.payload.id)) {
                    state.posts.push(action.payload);
                }
            })
            .addCase(getPost.rejected, (state, action) => {
                state.error = action.error.message || 'An error occurred';
                state.loading = false;
            });
    },
});

export default postsSlice.reducer;
