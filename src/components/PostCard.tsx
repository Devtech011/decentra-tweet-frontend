import React, { useState, useRef, useEffect } from 'react';
import type { PostCardProps } from '../utils/types/post.types';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const navigate = useNavigate();
  const { address } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { id, content, username, profile_pic_url, timestamp, likes_count, comments_count, is_liked, wallet_address } = post;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewPost = () => {
    navigate(`/post/${id}`);
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      setIsMenuOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
    }
  };

  const isOwnPost = wallet_address === address;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 relative">
      {/* Three dots menu button */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
          disabled={isDeleting}
        >
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={handleViewPost}
                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
                role="menuitem"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Post</span>
              </button>
              {isOwnPost && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  role="menuitem"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Post</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
      <div className="mt-4 flex items-center space-x-4">
        <LikeButton 
          postId={id} 
          initialLikes={likes_count || 0} 
          isLiked={is_liked || false} 
          onLike={() => onLike(id)} 
        />
        <button
          onClick={handleViewPost}
          className="px-3 py-1.5 rounded-full text-sm transition-colors duration-200 flex items-center space-x-1.5 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400"
        >
          <svg 
            className="w-4 h-4 stroke-current fill-none" 
            viewBox="0 0 24 24" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span>{comments_count || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
