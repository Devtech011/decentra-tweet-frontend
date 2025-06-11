export interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  isLiked: boolean;
  onLike: (postId: string) => Promise<void>;
  onUnlike: (postId: string) => Promise<void>;
} 