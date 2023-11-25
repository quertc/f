import React from 'react';
import { MantineProvider } from '@mantine/core';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Notifications } from '@mantine/notifications';
import modularGamesGoerli from '../utils/chain';

interface WrapperProps {
  children: React.ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  const { chains, publicClient } = configureChains(
    [modularGamesGoerli],
    [publicProvider()],
  );

  const { connectors } = getDefaultWallets({
    appName: '2048 Reward',
    projectId: 'NO_ID', // needed in production
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontFamilyMonospace: 'Space Grotesk, Courier, monospace',
        headings: { fontFamily: 'Space Grotesk, sans-serif' },
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <Notifications />
        <RainbowKitProvider chains={chains} modalSize="compact" theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </MantineProvider>
  );
}
