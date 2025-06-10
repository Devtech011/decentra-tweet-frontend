import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import toast from 'react-hot-toast';

export interface AuthContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  isRegistered: boolean;
  loading: boolean;
  userData: {
    wallet_address: `0x${string}`;
    username?: string;
    bio?: string;
    profile_pic_url?: string;
    is_registered?: boolean;
  } | null;
  error: string | null;
  verifyWallet: (customAddress?: string) => Promise<void>;
  fetchUserProfile: (wallet: `0x${string}`) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<AuthContextType['userData']>(null);
  const [error, setError] = useState<string | null>(null);
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = useCallback(async (wallet: `0x${string}`) => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/users/${wallet}`);
      if (!res.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await res.json();
      setUserData((prevData: AuthContextType['userData']) => ({ ...prevData, ...data }));
    } catch (err: any) {
      toast.error(err.message || 'Error fetching profile');
      setError(err.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, [setUserData, setError]);

  useEffect(() => {
    if (isVerified && address && !userData?.username) {
      fetchUserProfile(address);
    }
  }, [isVerified, address, userData?.username, fetchUserProfile]);

  const verifyWallet = async (customAddress?: string) => {
    if (!customAddress && !address) return;
    setLoading(true);
    setError(null);
    const walletAddress = customAddress ? customAddress as `0x${string}` : address;

    try {
      // Use a static message for signing
      const messageToSign = `Sign this message to login to DecentraTweet: ${walletAddress}`;

      // Sign the message
      const signature = await signMessageAsync({
        message: messageToSign,
      });

      // Verify the signature with the backend in a single call
      const verificationResponse = await fetch('http://localhost:3001/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          message: messageToSign,
          signature: signature,
        }),
      });

      if (!verificationResponse.ok) {
        throw new Error('Verification failed');
      }

      const data = await verificationResponse.json();
      if (data.valid && walletAddress) {
        setIsVerified(true);
        setIsRegistered(data.is_registered || false);
        toast.success('Wallet verified successfully! Fetching profile...');
      } else {
        setIsVerified(false);
        toast.error('Wallet verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    address,
    isConnected,
    isVerifying,
    isVerified,
    isRegistered,
    loading,
    userData,
    error,
    verifyWallet,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 