import { Chain } from 'wagmi';

const modulargamesgoerli = {
  id: 20482049,
  name: 'ModularGamesGoerli',
  network: 'modulargamesgoerli',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://goerli.modulargames.xyz/'] },
    default: { http: ['https://goerli.modulargames.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'ModularGamesGoerli Explorer', url: 'https://goerli-explorer.modulargames.xyz/' },
  },
  testnet: true,
} as const satisfies Chain;

export default modulargamesgoerli;
