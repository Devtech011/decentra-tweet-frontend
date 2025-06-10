import React from 'react';

const dummyProfile = { walletAddress: '0x123...', username: 'DummyUser', bio: 'This is a dummy bio for the MVP.', profilePicUrl: 'https://via.placeholder.com/150' };

const ProfileCard: React.FC = () => {
  const { walletAddress, username, bio, profilePicUrl } = dummyProfile;
  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-lg backdrop-blur">
      <div className="flex flex-col items-center">
        <img src={profilePicUrl} alt="Profile Pic" className="w-20 h-20 rounded-full" />
        <h2 className="mt-2 text-xl font-semibold text-white">{username}</h2>
        <p className="mt-1 text-sm text-purple-300">Wallet: {walletAddress}</p>
        <p className="mt-2 text-sm text-white">{bio}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
