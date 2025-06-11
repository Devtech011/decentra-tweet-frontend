export interface AuthContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  isRegistered: boolean;
  loading: boolean;
  userData: UserData | null;
  error: string | null;
  verifyWallet: (customAddress?: string) => Promise<void>;
  fetchUserProfile: (wallet: `0x${string}`) => Promise<void>;
  setIsRegistered: (value: boolean) => void;
}

export interface UserData {
  wallet_address: `0x${string}`;
  username?: string;
  bio?: string;
  profile_pic_url?: string;
  is_registered?: boolean;
} 