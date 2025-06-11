import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { address, userData, setIsRegistered, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isCreatingProfile = !userData || !userData.username;

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.username || '');
      setBio(userData.bio || '');
      setProfilePicUrl(userData.profile_pic_url || '');
    }
    if (isCreatingProfile) {
      setIsEditing(true);
    }
  }, [userData, isCreatingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!address) {
      toast.error('Wallet address not found.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: address,
          username: displayName,
          bio: bio,
          profile_pic_url: profilePicUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await res.json();
      if (data.is_registered !== undefined) {
        setIsRegistered(true);
      }
      await fetchUserProfile(address);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || (isCreatingProfile ? 'Error creating profile' : 'Error updating profile'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="p-2 sm:p-4 md:p-6">
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
          <span className="font-medium">Back to Home</span>
          </button>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700/50 w-full">
          <h1 className="text-3xl font-bold mb-4 text-center">{isCreatingProfile ? 'Create Your Profile' : 'User Profile'}</h1>
          <p className="text-gray-300 mb-6 text-center">{isCreatingProfile ? 'Set up your public profile to get started.' : 'Manage your public profile information.'}</p>

        <div className="mb-4 text-left">
          <p className="text-gray-400 text-sm">Wallet Address:</p>
            <p className="text-lg font-mono break-words bg-gray-700/30 p-2 rounded-md">{address || 'Not Connected'}</p>
        </div>

        {!isEditing && !isCreatingProfile ? (
          <div className="space-y-4 text-left">
            {userData?.profile_pic_url && (
              <div className="flex justify-center mb-4">
                  <img src={userData.profile_pic_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-lg" />
              </div>
            )}
            <div>
              <p className="text-gray-400 text-sm">Display Name:</p>
                <p className="text-xl font-semibold bg-gray-700/30 p-2 rounded-md">{userData?.username || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bio:</p>
                <p className="text-sm whitespace-pre-wrap bg-gray-700/30 p-2 rounded-md">{userData?.bio || 'No bio set.'}</p>
            </div>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out mt-4 shadow-lg hover:shadow-blue-500/25"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isCreatingProfile && (
                <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-md p-2">You must create a profile before proceeding.</p>
            )}
            <div>
                <label htmlFor="profilePicUrl" className="block text-gray-300 text-sm font-bold mb-2 text-left">Profile Picture URL</label>
              <input
                type="url"
                id="profilePicUrl"
                  className="appearance-none rounded w-full py-2.5 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 border border-gray-600 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., https://example.com/my-pic.jpg"
                value={profilePicUrl}
                onChange={(e) => setProfilePicUrl(e.target.value)}
              />
              <p className="text-gray-500 text-xs mt-1 text-left">Optional: URL to your profile image.</p>
            </div>

            <div>
                <label htmlFor="displayName" className="block text-gray-300 text-sm font-bold mb-2 text-left">Display Name</label>
              <input
                type="text"
                id="displayName"
                  className="appearance-none rounded w-full py-2.5 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 border border-gray-600 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., CryptoEnthusiast123"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                maxLength={30}
              />
              <p className="text-gray-500 text-xs mt-1 text-left">Choose a public name (max 30 characters).</p>
            </div>

            <div>
                <label htmlFor="bio" className="block text-gray-300 text-sm font-bold mb-2 text-left">Bio</label>
              <textarea
                id="bio"
                  className="appearance-none rounded w-full py-2.5 px-4 text-sm text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 border border-gray-600 focus:border-blue-500 h-24 resize-none transition-colors duration-200"
                placeholder="Tell us about yourself (max 160 characters)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
              ></textarea>
              <p className="text-gray-500 text-xs mt-1 text-left">Optional: A short description (max 160 characters).</p>
            </div>

            <button
              type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isCreatingProfile ? 'Create Profile' : 'Update Profile')}
            </button>
            {!isCreatingProfile && (
              <button
                type="button"
                  className="ml-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out shadow-lg hover:shadow-gray-500/25"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 