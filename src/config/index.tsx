import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');


// Create the WagmiAdapter configuration
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia],
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;
