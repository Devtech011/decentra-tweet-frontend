import React, { useState } from 'react';

interface PostComposerProps {
  onSubmit: (content: string) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full p-2 rounded bg-white/10 text-white border border-purple-300"
        placeholder="What's on your mind? (max 280 chars)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md font-semibold text-sm transition-all duration-200"
      >
        Post
      </button>
    </form>
  );
};

export default PostComposer;
