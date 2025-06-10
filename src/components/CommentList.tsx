import React from 'react';

 const dummyComments = [
   { id: 1, postId: 1, walletAddress: '0xabc...', content: 'Dummy comment 1', timestamp: new Date().toISOString() },
   { id: 2, postId: 1, walletAddress: '0xdef...', content: 'Dummy comment 2', timestamp: new Date().toISOString() }
 ];

interface CommentListProps {
  postId: number;
  comments: Array<{ id: number; postId: number; walletAddress: string; content: string; timestamp: string; }>;
}

const CommentList: React.FC<CommentListProps> = ({ postId, comments }) => {
  // In a real app, you might filter comments by postId or use a prop.
  const postComments = dummyComments.filter(comment => comment.postId === postId);
  return (
    <div className="mt-2">
      <h4 className="text-sm font-semibold text-purple-300">Comments ({postComments.length})</h4>
      { postComments.map(comment => ( <div key={comment.id} className="mt-1 text-xs text-gray-300"> {comment.walletAddress} – {comment.content} – {new Date(comment.timestamp).toLocaleString()} </div> )) }
    </div>
  );
};

export default CommentList;
