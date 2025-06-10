import ProfileEditForm from '../components/ProfileEditForm';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { address } = useAuth();

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white">
        <div className="text-center p-8 bg-white/10 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Waiting for Wallet Address...</h2>
          <p>Please ensure your wallet is connected and verified.</p>
          <p className="text-sm mt-2 text-purple-300">Current address status: {address === undefined ? 'undefined' : address === null ? 'null' : 'available but empty'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-700 text-white p-6 flex flex-col items-center justify-center">
      <ProfileEditForm walletAddress={address} />
    </div>
  );
};

export default Profile;
