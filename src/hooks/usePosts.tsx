import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  wallet_address: string;
  content: string;
  timestamp: string;
  username?: string;
  profile_pic_url?: string;
  likes: { wallet_address: string }[];
  likes_count?: number;
  is_liked?: boolean;
  comments_count?: number;
}

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalPosts: number;
  currentPage: number;
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  fetchPostById: (postId: string) => Promise<Post | null>;
  createPost: (content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001';

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { address, userData } = useAuth();

  const fetchPosts = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/posts?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data: PostsResponse = await response.json();
      const postsWithLikeStatus = data.posts.map(post => {
        const isLiked = (post.likes ?? []).some(like => like.wallet_address.toLowerCase() === address.toLowerCase());
        const likesCount = (post.likes ?? []).length;
        return { ...post, is_liked: isLiked, likes_count: likesCount };
      });

      setPosts(postsWithLikeStatus);
      setTotalPosts(data.total);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const fetchPostById = useCallback(async (postId: string): Promise<Post | null> => {
    if (!address) {
      setError('Please connect your wallet first');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const post = await response.json();
      const isLiked = (post?.likes ?? []).some((like: { wallet_address: string }) => like.wallet_address.toLowerCase() === address.toLowerCase());
      const likesCount = (post?.likes ?? []).length;
      
      return {
        ...post,
        is_liked: isLiked,
        likes_count: likesCount
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch post');
      return null;
    } finally {
      setLoading(false);
    }
  }, [address]);

  const createPost = useCallback(async (content: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: address,
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Force a complete refresh of posts
      await fetchPosts(1);
      toast.success('Post created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  }, [address, fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Store the previous state in case we need to revert
    const previousPosts = posts;

    // Optimistically update the UI
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = (post.likes ?? []).some(like => like.wallet_address.toLowerCase() === address.toLowerCase());
          const newLikes = isLiked
            ? (post.likes ?? []).filter(like => like.wallet_address.toLowerCase() !== address.toLowerCase())
            : [...(post.likes ?? []), { wallet_address: address }];
          const likesCount = newLikes.length;
          return { ...post, likes: newLikes, is_liked: !isLiked, likes_count: likesCount };
        }
        return post;
      });
    });

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }
    } catch (err) {
      // Revert to previous state on error
      setPosts(previousPosts);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to like post');
    }
  }, [address, posts]);

  const deletePost = useCallback(async (postId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    // Store the previous state in case we need to revert
    const previousPosts = posts;

    // Optimistically update the UI
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      toast.success('Post deleted successfully!');
    } catch (err) {
      // Revert to previous state on error
      setPosts(previousPosts);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  }, [address, posts]);

  return {
    posts,
    loading,
    error,
    totalPosts,
    currentPage,
    fetchPosts,
    fetchPostById,
    createPost,
    likePost,
    deletePost,
  };
};

export default usePosts; 