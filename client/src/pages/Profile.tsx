import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpAxios, ROUTES } from "../utils/axios";
import Modal from "../components/Modal";
import { queryKeys } from "../utils/query-keys";
import { userApi } from "../utils/axios/queries";
import type { UserInfoType } from "../types/zustand/user.types";

const Profile: React.FC = () => {
  const { userInfo, settings, updateNetworkMode, setUserInfo } = useUserStore();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { mutate: updateNetwork, isPending } = useMutation({
    mutationFn: async (mode: "mainnet" | "devnet") => {
      const res = await httpAxios.patch(ROUTES.SETTINGS.ROOT, { mode });
      return res.data;
    },
    onSuccess: (_data, mode) => {
      updateNetworkMode(mode);
    },
  });

  const { refetch, isFetching, data, isError } = useQuery({
    queryKey: queryKeys.user.secret,
    queryFn: userApi.getPrivateKey,
    enabled: false,
  });

  // Handle success/error after refetch
  React.useEffect(() => {
    if (data && !isFetching) {
      const updatedUserInfo = {
        ...userInfo,
        wallet: {
          ...userInfo?.wallet,
          privateKey: data.data.key as string,
        },
      };
      setUserInfo(updatedUserInfo as UserInfoType);
      setShowPrivateKey(true);
      setIsModalOpen(false);
    }
  }, [data, isFetching]);

  React.useEffect(() => {
    if (isError) {
      setIsModalOpen(false);
    }
  }, [isError]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToShowPrivateKey = () => {
    if (showPrivateKey) {
      setShowPrivateKey(false);
      return;
    }

    setIsModalOpen(true);
  };

  const handleToConfirmShowPrivateKey = async () => {
    if (userInfo?.wallet.privateKey) {
      setShowPrivateKey(true);
      setIsModalOpen(false);
      return;
    }
    await refetch();
  };

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all ease-in-out duration-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-text-primary text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
            Profile
          </h1>
          <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
            Manage your account and wallet settings
          </p>
        </header>

        {/* User Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-dark p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                {userInfo?.photoUrl ? (
                  <img
                    src={userInfo.photoUrl}
                    alt={userInfo.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-primary text-3xl">
                    account_circle
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-text-primary text-xl font-bold">
                  {userInfo?.name || "User"}
                </h2>
                <p className="text-text-secondary text-sm">
                  {userInfo?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">User ID</span>
                <span className="text-text-primary text-sm font-mono">
                  {userInfo?.id || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Network</span>
                <span className="text-text-primary text-sm font-semibold uppercase">
                  {settings?.mode || "devnet"}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Keys Card */}
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card-dark p-6">
            <h3 className="text-text-primary text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                vpn_key
              </span>
              Wallet Keys
            </h3>

            {/* Public Key */}
            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">
                  key
                </span>
                Public Key
              </label>
              <div className="flex items-center gap-2 bg-background-dark border border-border rounded-lg px-3 py-2">
                <div className="flex-1 font-mono text-xs text-text-primary overflow-x-auto scrollbar-thin whitespace-nowrap">
                  {userInfo?.wallet.publicKey || "No public key available"}
                </div>
                <button
                  onClick={() =>
                    handleCopy(userInfo?.wallet.publicKey || "", "public")
                  }
                  className="p-2 hover:bg-hover-light rounded-lg transition-colors"
                  title="Copy public key"
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      copiedField === "public" ? "text-primary" : "text-text-muted"
                    }`}
                  >
                    {copiedField === "public" ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
            </div>

            {/* Private Key */}
            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-red text-base">
                  lock
                </span>
                Private Key
                <span className="text-red text-xs">(Keep Secret!)</span>
              </label>
              <div className="flex items-center gap-2 bg-background-dark border border-red/30 rounded-lg px-3 py-2">
                <div className="flex-1 font-mono text-xs text-text-primary overflow-x-auto scrollbar-thin whitespace-nowrap">
                  {showPrivateKey ? (
                    <span>
                      {userInfo?.wallet.privateKey || "Private key not available"}
                    </span>
                  ) : (
                    <span className="text-text-muted">
                      ••••••••••••••••••••••••••••••••
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleToShowPrivateKey()}
                  className="p-2 hover:bg-hover-light rounded-lg transition-colors"
                  title={showPrivateKey ? "Hide" : "Show"}
                >
                  <span className="material-symbols-outlined text-text-muted text-lg">
                    {showPrivateKey ? "visibility_off" : "visibility"}
                  </span>
                </button>
                {showPrivateKey && userInfo?.wallet.privateKey && (
                  <button
                    onClick={() =>
                      handleCopy(userInfo?.wallet.privateKey || "", "private")
                    }
                    className="p-2 hover:bg-hover-light rounded-lg transition-colors"
                    title="Copy private key"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        copiedField === "private" ? "text-primary" : "text-text-muted"
                      }`}
                    >
                      {copiedField === "private" ? "check" : "content_copy"}
                    </span>
                  </button>
                )}
              </div>
              <p className="text-red/80 text-xs flex items-start gap-1">
                <span className="material-symbols-outlined text-sm">
                  warning
                </span>
                Never share your private key with anyone!
              </p>
            </div>
          </div>
        </section>

        {/* Network Mode */}
        <section className="rounded-xl border border-border bg-card-dark p-6">
          <h3 className="text-text-primary text-lg font-bold flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">
              language
            </span>
            Network Mode
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Current:{" "}
            <span className="text-text-primary font-semibold uppercase">
              {settings?.mode || "devnet"}
            </span>
          </p>
          <div className="inline-flex rounded-lg overflow-hidden border border-border">
            <button
              disabled={isPending || settings?.mode === "mainnet"}
              onClick={() => updateNetwork("mainnet")}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                settings?.mode === "mainnet"
                  ? "bg-primary text-background-dark"
                  : "bg-hover-light text-text-primary hover:bg-white/10"
              } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              Mainnet
            </button>
            <button
              disabled={isPending || settings?.mode === "devnet"}
              onClick={() => updateNetwork("devnet")}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-l border-border ${
                settings?.mode === "devnet"
                  ? "bg-primary text-background-dark"
                  : "bg-hover-light text-text-primary hover:bg-white/10"
              } ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              Devnet
            </button>
          </div>
          <p className="text-text-muted text-xs mt-2">
            Switch between Solana networks. Changes are saved to your settings.
          </p>
        </section>

        {/* Security Warning */}
        <section className="rounded-xl border border-red/30 bg-red/5 p-4 sm:p-6">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-red text-2xl flex-shrink-0">
              shield
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-text-primary text-lg font-bold">
                Security Notice
              </h3>
              <ul className="text-text-secondary text-sm space-y-1 list-disc list-inside">
                <li>Keep your private key secure and never share it</li>
                <li>
                  We will never ask you for your private key via email or
                  support
                </li>
                <li>
                  Store your keys in a secure location like a password manager
                </li>
                <li>Consider using a hardware wallet for large amounts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onOk={handleToConfirmShowPrivateKey}
        onCancel={() => setIsModalOpen(false)}
        title="Private Key Access"
        message="Accessing your private key can be risky. Ensure you are in a secure environment."
        status="warning"
        isLoading={isFetching}
      />
    </main>
  );
};

export default Profile;
