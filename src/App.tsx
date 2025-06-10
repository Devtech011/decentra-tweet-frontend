import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import { useAuth, AuthProvider } from './hooks/useAuth.tsx';
import { Toaster } from 'react-hot-toast';
import PostList from './components/PostList';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import PostComposerModal from './components/PostComposerModal';
import PostDetailPage from './pages/PostDetailPage';

const MainApp: React.FC = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white">
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <div className="md:w-full flex flex-col gap-6">
          <PostList 
            isPostModalOpen={isPostModalOpen}
            onOpenPostModal={() => setIsPostModalOpen(true)}
            onClosePostModal={() => setIsPostModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { isVerified, isRegistered, loading: authLoading, userData } = useAuth();

  const isAddressValid = isVerified && !isRegistered;

  return (
    <Router>
      <Navbar />
      <Routes>
        {!isVerified ? (
          <Route path="*" element={<Home />} />
        ) : isAddressValid ? (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<MainApp />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      <Toaster />
    </Router>
  );
};

const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
