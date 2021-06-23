export const REPOSITORY_URL = process.env.REPOSITORY_URL;
export const SERVER_URL = process.env.SERVER_URL;
export const REPOSITORY_URL_FULL_MATCH = `${REPOSITORY_URL}/contracts/full_match`;
export const REPOSITORY_URL_PARTIAL_MATCH = `${REPOSITORY_URL}/contracts/partial_match`;
export const IPFS_GATEWAY = "https://gateway.ipfs.io/ipns/QmNmBr4tiXtwTrHKjyppUyAhW1FQZMJTdnUrksA9hapS4u";

export const chainOptions = [
  { value: "mainnet", label: "Ethereum Mainnet", id: 1 },
  { value: "ropsten", label: "Ropsten", id: 3 },
  { value: "rinkeby", label: "Rinkeby", id: 4 },
  { value: "kovan", label: "Kovan", id: 42 },
  { value: "goerli", label: "Görli", id: 5 },
  { value: "xdai", label: "xDAI", id: 100 },
  { value: "sokol", label: "Sokol", id: 77 }
];
