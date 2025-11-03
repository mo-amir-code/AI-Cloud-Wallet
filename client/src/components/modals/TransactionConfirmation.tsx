import React from "react";

interface ConfirmSendModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  recipient?: string;
  amount?: string;
  asset?: string;
  networkFee?: number;
  totalDebit?: string;
  isLoading?: boolean;
}

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  recipient = "",
  amount = "0",
  asset = "sol",
  networkFee = 0.000005,
  totalDebit = "0",
  isLoading = false,
}) => {
  if (!visible) return null;

  const getAssetName = (assetCode: string) => {
    const assets: { [key: string]: string } = {
      sol: "Solana",
      usdc: "USD Coin",
      usdt: "Tether",
    };
    return assets[assetCode.toLowerCase()] || assetCode.toUpperCase();
  };

  const formatAddress = (address: string) => {
    if (!address) return "N/A";
    if (address.endsWith('.sol')) return address;
    if (address.length > 20) {
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }
    return address;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-linear-to-br from-primary/20 to-primary/30 border border-border-dark rounded-2xl shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex justify-center items-center bg-primary/10 rounded-full size-16 mb-4 border-4 border-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl">
                arrow_upward
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">Confirm Send</h2>
            <p className="text-gray-400 mt-1">
              Please review the transaction details below.
            </p>
          </div>

          <div className="space-y-4 mb-8 bg-black/20 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-sm">To</span>
              <div className="text-right max-w-[65%]">
                <span className="text-white text-sm font-mono block break-all">
                  {formatAddress(recipient)}
                </span>
                <span className="text-xs text-gray-500">{getAssetName(asset)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Amount</span>
              <span className="text-white text-lg font-bold">
                {parseFloat(amount || "0").toFixed(6)} {asset.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Network Fee</span>
              <span className="text-white text-sm font-mono">
                ~{networkFee.toFixed(6)} {asset.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="border-t border-border-dark pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-300">Total Debit</span>
              <span className="text-primary text-2xl font-extrabold">
                {totalDebit} {asset.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-b-2xl flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
                <span className="truncate">Processing...</span>
              </div>
            ) : (
              <span className="truncate">Confirm &amp; Send</span>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent text-gray-300 hover:bg-white/10 text-base font-medium leading-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSendModal;
