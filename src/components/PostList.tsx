import React, { useEffect, useState } from 'react';
import type { PostListProps } from '../utils/types/post.types';
import PostCard from './PostCard';
import { usePosts } from '../hooks/usePosts';
import PostComposerModal from './PostComposerModal';
import { useNavigate } from 'react-router-dom';

const PostList: React.FC<PostListProps> = ({ isPostModalOpen, onOpenPostModal, onClosePostModal }) => {
  const navigate = useNavigate();
  const { posts, loading, error, fetchPosts, likePost, deletePost } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = async () => {
    await fetchPosts();
    onClosePostModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/10 rounded-lg border border-red-500/20">
        <p className="text-red-400">Error loading posts: {error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

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

      {isPostModalOpen && (
        <PostComposerModal 
          onClose={onClosePostModal}
          onPostCreated={handlePostCreated}
        />
      )}

      {posts.length === 0 && !loading ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400 text-lg mb-4">No posts yet</p>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={likePost}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default PostList;