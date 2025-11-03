export const queryKeys = {
  user: {
    info: ["user", "info"] as const,
    secret: ["user", "secret"] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    detail: (id: string) => ["contacts", id] as const,
  },
  tokens: {
    all: ["tokens"] as const,
    trending: ["tokens", "trending"] as const,
    wallet: (address: string, network: string) => ["tokens", "wallet", address, network] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (address: string, network: string) => ["transactions", address, network] as const,
  },
  network: {
    fee: (network: string) => ["network", "fee", network] as const,
  },
} as const;
