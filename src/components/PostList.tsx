import React, { useEffect, useMemo, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PostComposerModal from './PostComposerModal';

interface PostListProps {
  isPostModalOpen: boolean;
  onOpenPostModal: () => void;
  onClosePostModal: () => void;
}

const PostList: React.FC<PostListProps> = ({ isPostModalOpen, onOpenPostModal, onClosePostModal }) => {
  const { posts, loading, error, fetchPosts, likePost, deletePost, totalPosts, currentPage } = usePosts();
  const { comments, loading: commentsLoading, error: commentsError, fetchComments, createComment } = useComments();
  const { address } = useAuth();
  const navigate = useNavigate();

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Initial fetch
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Refresh when modal closes
  useEffect(() => {
    if (!isPostModalOpen) {
      fetchPosts(currentPage);
    }
  }, [isPostModalOpen, fetchPosts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchPosts(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Previous
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg ${
          currentPage === totalPages
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Next
      </button>
    );

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        {pages}
      </div>
    );
  };

  const handleCloseModal = () => {
    onClosePostModal();
    // Force a refresh after modal closes
    setTimeout(() => {
      fetchPosts();
    }, 100);
  };

  const handleLike = async (postId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }
    await likePost(postId);
  };

  const handleDelete = async (postId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(postId);
    }
  };

  const handleCommentToggle = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newCommentContent.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    await createComment(postId, newCommentContent);
    setNewCommentContent('');
    fetchComments(postId);
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

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 rounded-lg">
        <p className="text-red-400">Error loading posts: {error}</p>
        <button
          onClick={() => fetchPosts()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
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
        <span className="font-medium">Back to previous page</span>
      </button>
      <div className="flex justify-end mb-6">
        <button
          onClick={onOpenPostModal}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold text-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Post</span>
        </button>
      </div>

      {loading && posts.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {posts.length === 0 && !loading ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400 text-lg mb-4">No posts yet</p>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => {
            return (
              <div
                key={post.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      {post.profile_pic_url ? (
                        <img
                          src={post.profile_pic_url}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {post.username?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {post.username || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDate(post.timestamp || '')}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPostId(null);
                        setShowDropdownId(showDropdownId === post.id ? null : post.id);
                      }}
                      className="text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
                      title="More options"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>

                    {showDropdownId === post.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg z-10 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post.id}`);
                            setShowDropdownId(null);
                          }}
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                        >
                          View
                        </button>
                        {post.wallet_address === address && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(post.id);
                              setShowDropdownId(null);
                            }}
                            className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-white mb-4 whitespace-pre-wrap break-words">{post.content}</p>

                <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    <span>{post.likes_count}</span>
                  </button>
                  <button
                    onClick={() => handleCommentToggle(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      expandedPostId === post.id ? 'text-blue-400' : 'text-gray-400 hover:text-blue-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{post.comments_count || 0}</span>
                  </button>
                </div>

                {expandedPostId === post.id && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h4 className="text-white text-lg font-semibold mb-3">Comments</h4>
                    {commentsLoading && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      </div>
                    )}
                    {commentsError && (
                      <p className="text-red-400 text-center py-4">Error loading comments: {commentsError}</p>
                    )}
                    {!commentsLoading && comments.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">No comments yet. Be the first to comment!</p>
                    ) : (
                      <div className="space-y-3 max-h-10 overflow-y-auto pr-2 border border-blue-500">
                        {comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-700/50 p-3 rounded-lg flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                              {comment.profile_pic_url ? (
                                <img
                                  src={comment.profile_pic_url}
                                  alt="Profile"
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span>{comment.username?.[0]?.toUpperCase() || '?'}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">{comment.username || 'Anonymous'}</div>
                              <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                              <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {address && (
                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="text"
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          className="flex-grow px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPosts > 0 && renderPagination()}

      <PostComposerModal isOpen={isPostModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PostList;