import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { NavbarProps } from '../utils/types/profile.types';

// No props needed for Navbar currently
const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const { userData, address, isVerified } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getProfileDisplay = () => {
    if (userData?.profile_pic_url) {
      return (
        <img
          src={userData.profile_pic_url}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
        />
      );
    } else if (userData?.username) {
      const initial = userData.username.charAt(0).toUpperCase();
      return (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm border-2 border-blue-400">
          {initial}
        </div>
      );
    } else if (address) {
      const initial = address.charAt(2).toUpperCase();
      return (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-sm border-2 border-gray-400">
          {initial}
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>DecentraTweet</div>
        <div className="flex items-center space-x-4">
          {/* Profile Display - show if verified */}
          {(isVerified && address) && (
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleProfileClick}>
              {getProfileDisplay()}
              {userData?.username && <span className="text-gray-100 font-semibold hidden sm:block">{userData.username}</span>}
            </div>
          )}
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 