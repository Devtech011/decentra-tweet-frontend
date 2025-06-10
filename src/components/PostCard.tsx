import React from 'react';
import LikeButton from './LikeButton';
import CommentList from './CommentList';

interface Post {
  id: number;
  walletAddress: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Array<{ id: number; postId: number; walletAddress: string; content: string; timestamp: string; }>;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, walletAddress, content, timestamp, likes, comments } = post;
  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-lg backdrop-blur">
      <div className="flex justify-between">
        <span className="text-sm text-purple-300">Wallet: {walletAddress}</span>
        <span className="text-xs text-gray-400">{new Date(timestamp).toLocaleString()}</span>
      </div>
      <p className="mt-2 text-white">{content}</p>
      <div className="mt-2 flex justify-between">
        <LikeButton postId={id} likes={likes} />
        <CommentList postId={id} comments={comments} />
      </div>
    </div>
  );
};

export default PostCard;
