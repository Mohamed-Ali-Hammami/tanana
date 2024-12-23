'use client'

import React, { ReactNode } from 'react';
import { config, projectId } from '@/config';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from '@reown/appkit/networks';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create Wagmi Adapter for AppKit
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia], // Adjusted to work with Reown AppKit
  projectId,
});

// Initialize AppKit with Wagmi Adapter
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia],
  metadata: {
    name: 'Reown AppKit',
    description: 'Reown AppKit Example',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: any;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
