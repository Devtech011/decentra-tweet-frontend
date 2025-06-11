export interface Post {
  id: string;
  content: string;
  wallet_address: string;
  username?: string;
  profile_pic_url?: string;
  timestamp: string;
  likes: number;
  comments: number;
  is_liked?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
}

export interface PostListProps {
  isPostModalOpen: boolean;
  onOpenPostModal: () => void;
  onClosePostModal: () => void;
}

export interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onUnlike: (postId: string) => Promise<void>;
}

export interface PostComposerProps {
  onPostCreated: () => void;
}

export interface PostComposerModalProps {
  onClose: () => void;
  onPostCreated: () => void;
} 