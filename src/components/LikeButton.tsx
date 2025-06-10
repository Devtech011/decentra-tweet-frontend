import React from 'react';

interface LikeButtonProps {
  postId: number;
  likes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, likes }) => {
  return (
    <button className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-sm">
      Like ({likes})
    </button>
  );
};

export default LikeButton;
