export interface Comment {
  id: string;
  content: string;
  wallet_address: string;
  username?: string;
  profile_pic_url?: string;
  timestamp: string;
  likes: number;
  is_liked?: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

export interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: () => Promise<void>;
  addComment: (content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  unlikeComment: (commentId: string) => Promise<void>;
}

export interface CommentListProps {
  postId: string;
  onCommentAdded: () => void;
} 