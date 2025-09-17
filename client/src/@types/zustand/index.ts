type AppStoreState = {
  isMenuOpen: boolean;
};

type AppStoreActions = {
  setIsMenuOpen: (status: boolean) => void;
};

export type { AppStoreState, AppStoreActions };
