import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPosts as fetchPostsAction,
  addPost as addPostAction,
  updatePost as updatePostAction,
  deletePost as deletePostAction,
  getPost as getPostAction,
} from '@/store/slices/postsSlice';
import type { Post } from '@/types';

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  const fetchPosts = useCallback(async () => {
    await dispatch(fetchPostsAction());
  }, [dispatch]);

  const addPost = useCallback(
    async (post: Omit<Post, 'id' | 'userId'>) => {
      await dispatch(addPostAction(post)).unwrap();
    },
    [dispatch]
  );

  const updatePost = useCallback(
    async (id: number, post: Partial<Post>) => {
      await dispatch(updatePostAction({ id, post })).unwrap();
    },
    [dispatch]
  );

  const deletePost = useCallback(
    async (id: number) => {
      await dispatch(deletePostAction(id)).unwrap();
    },
    [dispatch]
  );

  const getPost = useCallback(
    async (id: number) => {
      const result = await dispatch(getPostAction(id)).unwrap();
      return result;
    },
    [dispatch]
  );

  return {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
    getPost,
  };
};
