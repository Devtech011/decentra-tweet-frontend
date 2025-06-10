import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DecentraTweet',
  projectId: 'your-project-id-here',
  chains: [mainnet, polygon, sepolia],
  ssr: false,
});