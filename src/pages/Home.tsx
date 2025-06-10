import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '../hooks/useAuth.tsx';

const Home = () => {
  const { isConnected } = useAccount();
  const { isVerifying, error, verifyWallet } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [inputAddress, setInputAddress] = useState('');
  const [localError, setLocalError] = useState('');

  const handleVerify = async () => {
    setLocalError('');
    if (!inputAddress) {
      setLocalError('Please enter your wallet address.');
      return;
    }
    try {
      await verifyWallet(inputAddress);
      setShowModal(false);
    } catch (e: any) {
      setLocalError(e.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-fuchsia-800 to-pink-700 text-white p-6 flex flex-col items-center justify-center">

      {/* Main content - Two panels */}
      <main className="w-full max-w-6xl flex flex-col md:flex-row gap-8 justify-between">
        {/* Left Panel - Welcome and Features */}
        <div className="bg-white/10 rounded-xl p-6 w-full md:w-1/3 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold mb-4">Welcome to DecentraTweet</h2>
          <p className="text-sm text-purple-200 mb-6">
            Experience the future of social media with blockchain-powered microblogging.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span> Wallet-based authentication
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-400 rounded-full"></span> 280-character posts
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-pink-400 rounded-full"></span> Like and comment
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span> Fully decentralized
            </li>
          </ul>
        </div>

        {/* Right Panel - Conditional Content */}
        <div className="bg-white/10 rounded-xl p-8 flex-1 text-center shadow-lg backdrop-blur">
          {!isConnected ? (
            // Content when wallet is NOT connected
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-4 rounded-full">
                  {/* Original 'plus' icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to DecentraTweet</h2>
              <p className="text-sm text-purple-200 mb-6">
                Connect your Ethereum wallet to start sharing your thoughts on the decentralized web.
              </p>
              <div className="bg-white/10 text-sm p-4 rounded-lg text-purple-300">
                Click "Connect Wallet" in the top right to get started
              </div>
            </>
          ) : (
            // Content when wallet IS connected but NOT verified
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-full">
                  {/* New 'lock' icon for verification */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm0-11V7a6 6 0 1112 0v3"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Verify Your Wallet</h2>
              <p className="text-sm text-purple-200 mb-6">
                Click the button below to confirm your wallet address and unlock full access.
              </p>
              <button
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg font-semibold text-lg transition-all duration-200"
                onClick={() => setShowModal(true)}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Address'}
              </button>
              {error && (
                <div className="mt-4 text-red-500 text-sm">{error}</div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal for address input (remains the same) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 transition-all duration-200">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-80 flex flex-col items-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Wallet Address</h2>
            <p className="text-gray-500 text-center mb-4 text-sm">Enter your wallet address to verify ownership.</p>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="0x..."
              value={inputAddress}
              onChange={e => setInputAddress(e.target.value)}
              autoFocus
            />
            {(localError || error) && <div className="text-red-500 text-sm mb-2 w-full text-center">{localError || error}</div>}
            <div className="flex gap-2 w-full mt-2">
              <button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                onClick={() => setShowModal(false)}
                disabled={isVerifying}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal fade-in animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;

