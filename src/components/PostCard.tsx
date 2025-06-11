import React from 'react';
import type { PostCardProps } from '../utils/types/post.types';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentList from './CommentList';

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onUnlike }) => {
  const navigate = useNavigate();
  const { id, content, username, profile_pic_url, timestamp, likes, comments, is_liked } = post;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-4">
        {profile_pic_url ? (
          <img
            src={profile_pic_url}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">
              {username?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-white">{username || 'Anonymous'}</div>
          <div className="text-sm text-gray-400">
            {new Date(timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
      <p className="mt-2 text-white">{content}</p>
      <div className="mt-2 flex justify-between">
        <LikeButton 
          postId={id} 
          initialLikes={likes} 
          isLiked={is_liked || false} 
          onLike={() => onLike(id)} 
          onUnlike={() => onUnlike(id)} 
        />
        <button
          onClick={() => navigate(`/post/${id}`)}
          className="text-gray-400 hover:text-white text-sm"
        >
          {comments} {comments === 1 ? 'comment' : 'comments'}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
