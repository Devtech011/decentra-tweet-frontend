import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import type { ProfileEditFormProps } from '../utils/types/profile.types';

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ walletAddress }) => {
  const { setIsRegistered } = useAuth(); // To update registration status after submission
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [bioCharCount, setBioCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      wallet_address: walletAddress.toLowerCase(),
      username,
      bio,
      profile_pic_url: profilePicUrl,
    };

    try {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create/update profile.');
      }

      toast.success('Profile created successfully!');
      // Assuming successful profile creation means the user is now registered
      setIsRegistered(true); // Update the global registration status
      // Redirection will be handled by App.tsx based on isRegistered
    } catch (err: any) {
      setSubmitError(err.message || 'Profile submission failed.');
      toast.error(err.message || 'Profile submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBio(text);
    setBioCharCount(text.length);
  };

  return (
    <div className="bg-white/10 rounded-xl p-6 sm:p-8 flex-1 text-center shadow-lg backdrop-blur mx-auto my-8 max-w-full sm:max-w-lg w-full">
    <div className="flex justify-center mb-4 sm:mb-6">
      <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 sm:p-4 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 sm:h-12 sm:w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    </div>
    <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Your Profile</h2>
    <p className="text-xs sm:text-sm text-purple-200 mb-6">Join the decentralized conversation</p>
  
    <form onSubmit={handleSubmit} className="space-y-4 text-left px-4 sm:px-0">
      <div>
        <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-purple-200 mb-1">Username</label>
        <input
          type="text"
          id="username"
          className="w-full p-2 sm:p-3 rounded-lg bg-white/10 text-white border border-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-xs sm:text-sm font-medium text-purple-200 mb-1">Bio</label>
        <textarea
          id="bio"
          className="w-full p-2 sm:p-3 rounded-lg bg-white/10 text-white border border-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={handleBioChange}
          maxLength={160}
          rows={3}
        />
        <p className="text-xs text-right text-purple-300">{bioCharCount}/160</p>
      </div>
      <div>
        <label htmlFor="profilePicUrl" className="block text-xs sm:text-sm font-medium text-purple-200 mb-1">Profile Picture URL (optional)</label>
        <input
          type="url"
          id="profilePicUrl"
          className="w-full p-2 sm:p-3 rounded-lg bg-white/10 text-white border border-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          placeholder="https://example.com/avatar.jpg"
          value={profilePicUrl}
          onChange={(e) => setProfilePicUrl(e.target.value)}
        />
      </div>
      {submitError && <div className="text-red-500 text-sm mt-2 text-center">{submitError}</div>}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
      </button>
    </form>
  </div>
  
  );
};

export default ProfileEditForm;
