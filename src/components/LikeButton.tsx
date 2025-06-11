import React from 'react';
import { LikeButtonProps } from '../utils/types/like.types';

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes, isLiked, onLike, onUnlike }) => {
  return (
    <button className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-sm">
      Like ({initialLikes})
    </button>
  );
};

export default LikeButton;
