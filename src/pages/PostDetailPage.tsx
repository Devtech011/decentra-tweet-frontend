import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useComments, type Comment } from '../hooks/useComments';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  wallet_address: string;
  content: string;
  timestamp: string;
  username?: string;
  profile_pic_url?: string;
  likes: {
    wallet_address: string;
    username?: string;
    profile_pic_url?: string;
  }[];
  likes_count?: number;
  is_liked?: boolean;
  comments_count?: number;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, fetchPostById, likePost, deletePost } = usePosts();
  const { 
    comments, 
    loading: commentsLoading, 
    error: commentsError, 
    fetchComments, 
    createComment,
    totalComments,
    currentPage,
    totalPages,
    likeComment
  } = useComments();
  const { address } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [showLikes, setShowLikes] = useState<boolean>(false);
  const commentsPerPage = 10;

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      const fetchedPost = await fetchPostById(id);
      if (fetchedPost) {
        setPost(fetchedPost);
        fetchComments(fetchedPost.id, 1, commentsPerPage);
      }
    };
    loadPost();
  }, [id, fetchPostById, fetchComments]);

  const handlePageChange = (page: number) => {
    if (!post || page < 1 || page > totalPages) return;
    fetchComments(post.id, page, commentsPerPage);
  };

  const handleLike = async () => {
    if (!post || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    await likePost(post.id);
    // Refresh the post after liking
    const updatedPost = await fetchPostById(post.id);
    if (updatedPost) {
      setPost(updatedPost);
    }
  };

  const handleDelete = async () => {
    if (!post || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
      navigate('/'); // Redirect to home after deletion
    }
  };

  const handleAddComment = async () => {
    if (!post || !newCommentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    await createComment(post.id, newCommentContent);
    setNewCommentContent('');
    fetchComments(post.id);
  };

  const handleLikeComment = async (commentId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }
    await likeComment(commentId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 rounded-lg">
        <p className="text-red-400">Error loading post: {error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Post not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }
  console.log('comments',comments)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors duration-200 group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Posts</span>
        </button>

        {/* Post Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50 mb-6 transform hover:scale-[1.01] transition-transform duration-200">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                {post.profile_pic_url ? (
                  <img
                    src={post.profile_pic_url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {post.username?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold text-white text-lg">
                  {post.username || 'Anonymous'}
                </div>
                <div className="text-sm text-gray-400">
                  {formatDate(post.timestamp)}
                </div>
              </div>
            </div>
            {post.wallet_address === address && (
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 rounded-full hover:bg-red-500/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Post Content */}
          <p className="text-white text-lg mb-6 whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </p>

          {/* Post Actions */}
          <div className="flex items-center space-x-6 pt-4 border-t border-gray-700/50">
            <div 
              onClick={() => setShowLikes(!showLikes)}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className={`flex items-center space-x-2 ${post.is_liked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'} transition-colors duration-200`}>
                <svg
                  className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200"
                  fill={post.is_liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-medium">{(post.likes_count || 0)}</span>
              </div>
              {(post.likes_count || 0) > 0 && (
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                  {(post.likes_count || 0) === 1 ? 'like' : 'likes'}
                </span>
              )}
            </div>
            {!post.is_liked && (
              <button
                onClick={handleLike}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-red-500/10"
              >
                Like
              </button>
            )}
          </div>

          {/* Likes Section */}
          {showLikes && post.likes && post.likes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fadeIn">
              <h4 className="text-lg font-semibold text-white mb-3">
                Liked by {post.likes.length} {post.likes.length === 1 ? 'person' : 'people'}
              </h4>
              <div className="space-y-2">
                {post.likes.map((like, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm bg-gray-700/30 p-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      {like.profile_pic_url ? (
                        <img
                          src={like.profile_pic_url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border border-gray-600"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {like.username?.[0]?.toUpperCase() || like.wallet_address?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-300 font-medium">
                      {like.username || formatWalletAddress(like.wallet_address)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Comments</h3>
            <span className="text-gray-400 text-sm bg-gray-700/30 px-3 py-1 rounded-full">
              {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
            </span>
          </div>
          
          {commentsLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {commentsError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-red-400">Error loading comments: {commentsError}</p>
            </div>
          )}

          {!commentsLoading && (!comments || comments.length === 0) ? (
            <div className="text-center py-8 bg-gray-700/30 rounded-lg">
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {(comments as Comment[]).map((comment) => (
                  <div key={comment.id} className="bg-gray-700/30 p-4 rounded-lg transform hover:scale-[1.01] transition-transform duration-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        {comment.profile_pic_url ? (
                          <img
                            src={comment.profile_pic_url}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border border-gray-600"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {comment.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-semibold text-white">{comment.username || 'Anonymous'}</div>
                          <div className="text-xs text-gray-400">
                            {formatDate(comment.timestamp)}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap break-words mt-1">{comment.content}</p>
                        <div className="flex items-center mt-2">
                         
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </>
          )}

          {/* Comment Input */}
          {address && (
            <div className="mt-6 flex items-center space-x-2">
              <input
                type="text"
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
                placeholder="Write a comment..."
                className="flex-grow px-4 py-2.5 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 focus:border-blue-500 transition-colors duration-200"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage; 