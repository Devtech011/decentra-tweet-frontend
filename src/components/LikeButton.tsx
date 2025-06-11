import React from 'react';
import type { LikeButtonProps } from '../utils/types/like.types';

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes, isLiked, onLike }) => {
  return (
    <button 
      onClick={() => !isLiked && onLike(postId)}
      disabled={isLiked}
      className={`px-3 py-1.5 rounded-full text-sm transition-colors duration-200 flex items-center space-x-1.5 ${
        isLiked 
          ? 'bg-red-500/20 text-red-500 cursor-default' 
          : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 hover:text-gray-300'
      }`}
    >
      <svg 
        className={`w-4 h-4 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`} 
        viewBox="0 0 24 24" 
        strokeWidth={isLiked ? 0 : 2}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      <span>{initialLikes}</span>
    </button>
  );
};

export default LikeButton;
