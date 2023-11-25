import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Button() {
  return (
    <ConnectButton
      label="Connect wallet"
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'address',
      }}
    />
  );
}
