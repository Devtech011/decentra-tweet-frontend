import React from 'react';
import type { CommentListProps, Comment } from '../utils/types/comment.types';
import { useComments } from '../hooks/useComments';

const CommentList: React.FC<CommentListProps> = ({ postId, onCommentAdded }) => {
  const { comments, loading, error, addComment, likeComment, unlikeComment } = useComments(postId);

  if (loading) {
    return <div className="text-gray-400">Loading comments...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error loading comments: {error}</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment: Comment) => (
        <div key={comment.id} className="bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            {comment.profile_pic_url ? (
              <img
                src={comment.profile_pic_url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">
                  {comment.username?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <span className="font-semibold text-white">{comment.username || 'Anonymous'}</span>
          </div>
          <p className="mt-2 text-white">{comment.content}</p>
          <div className="mt-2 flex justify-between items-center">
            <button
              onClick={() => comment.is_liked ? unlikeComment(comment.id) : likeComment(comment.id)}
              className={`text-sm ${comment.is_liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
            </button>
            <span className="text-xs text-gray-400">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
