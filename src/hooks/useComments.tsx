import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export interface Comment {
  id: string;
  post_id: string;
  wallet_address: string;
  content: string;
  timestamp: string;
  username?: string;
  profile_pic_url?: string;
  likes: { wallet_address: string }[];
  likes_count?: number;
  is_liked?: boolean;
}

interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  totalComments: number;
  currentPage: number;
  totalPages: number;
  fetchComments: (postId: string, page?: number, limit?: number) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001';

export const useComments = (): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { address } = useAuth();

  const fetchComments = useCallback(async (postId: string, page: number = 1, limit: number = 10) => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data: CommentsResponse = await response.json();
      setComments(data.comments);
      setTotalComments(data.total);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const createComment = useCallback(async (postId: string, content: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!content.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
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
        throw new Error('Failed to create comment');
      }

      const newComment = await response.json();
      setComments(prevComments => [newComment, ...prevComments]);
      setTotalComments(prev => prev + 1);
      toast.success('Comment added successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to create comment');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const likeComment = useCallback(async (commentId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Store the previous state in case we need to revert
    const previousComments = comments;

    // Optimistically update the UI
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          const isLiked = (comment.likes ?? []).some(like => like.wallet_address.toLowerCase() === address.toLowerCase());
          const newLikes = isLiked
            ? (comment.likes ?? []).filter(like => like.wallet_address.toLowerCase() !== address.toLowerCase())
            : [...(comment.likes ?? []), { wallet_address: address }];
          const likesCount = newLikes.length;
          return { ...comment, likes: newLikes, is_liked: !isLiked, likes_count: likesCount };
        }
        return comment;
      });
    });

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }
    } catch (err) {
      // Revert to previous state on error
      setComments(previousComments);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to like comment');
    }
  }, [address, comments]);

  return {
    comments,
    loading,
    error,
    totalComments,
    currentPage,
    totalPages,
    fetchComments,
    createComment,
    likeComment,
  };
}; 