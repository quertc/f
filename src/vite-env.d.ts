/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENDPOINT_URL: string;
  readonly VITE_REWARD_ADDRESS: `0x${string}`;
  readonly VITE_GAME48_ADDRESS: `0x${string}`;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
