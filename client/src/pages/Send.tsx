import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  PublicKey,
} from "@solana/web3.js";
import { SendTransactionConfirmation } from "../components/modals";
import { useUserStore } from "../stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { sendTransaction } from "../utils/axios/queries";
import { useToastStore } from "../stores/useToastStore";

const Send = () => {
  const location = useLocation();
  const [isTxnConfirmModalOpen, setIsTxnConfirmModalOpen] =
    useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>("");
  const [asset, setAsset] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(10);
  const [error, setError] = useState<string>("");
  const { tokens, setTokens } = useUserStore();
  const { addToast } = useToastStore();
  const [networkFee] = useState(0.000005);

  const mutation = useMutation({
    mutationFn: sendTransaction,
    onSuccess: async (_data) => {
      console.log("Transaction confirmed:", {
        recipient,
        amount,
        asset,
        networkFee,
      });

      // Reduce balance for the selected token and update the user store
      const selected = tokens.find((t) => t.symbol === asset);
      if (selected) {
        const decimals = selected.decimals || 0;
        const unit = Math.pow(10, decimals);
        const isSol = selected.symbol.toLowerCase() === "sol";

        const sentRaw = Math.round((parseFloat(amount) || 0) * unit);
        const feeRaw = isSol ? Math.round(networkFee * 1e9) : 0; // deduct fee only for SOL
        const deltaRaw = sentRaw + feeRaw;

        const newRaw = Math.max(0, (selected.rawBalance || 0) - deltaRaw);
        const newBalance = newRaw / unit;

        const updatedTokens = tokens.map((t) =>
          t.symbol === selected.symbol
            ? {
                ...t,
                rawBalance: newRaw,
                balance: newBalance.toFixed(decimals > 6 ? 6 : decimals),
              }
            : t
        );
        setTokens(updatedTokens);
      }

      setIsTxnConfirmModalOpen(false);
      setRecipient("");
      setAmount("");
      setError("");
      addToast("Transaction sent successfully!", "success");
    },
    onError: (error: any) => {
      console.error("Transaction failed:", error);
      const errorMessage =
        error?.message || "Transaction failed. Please try again.";
      setError(errorMessage);
      addToast(errorMessage, "error");
    },
  });

  useEffect(() => {
    const token = asset ? tokens.find((t) => t.symbol === asset) : undefined;
    // console.log("Selected asset:", asset, token);
    if (!asset) {
      setAvailableBalance(0);
      return;
    }
    if (token) {
      setAvailableBalance(token.rawBalance / Math.pow(10, token.decimals));
    }
  }, [asset, tokens]);

  // Pre-fill recipient if coming from contacts
  useEffect(() => {
    if (location.state?.recipient) {
      setRecipient(location.state.recipient);
    }
  }, [location.state]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipient(text.trim());
      setError("");
      addToast("Address pasted from clipboard", "info", 2000);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      const errorMsg = "Failed to paste from clipboard";
      setError(errorMsg);
      addToast(errorMsg, "error");
    }
  };

  const handleMaxAmount = () => {
    if (!asset) return;
    const isSol = asset.toLowerCase() === "sol";
    const maxAmount = isSol
      ? Math.max(0, availableBalance - networkFee)
      : availableBalance;
    setAmount(maxAmount.toFixed(6));
    setError("");
  };

  const calculateTotalDebit = () => {
    const amountNum = parseFloat(amount) || 0;
    const isSol = asset.toLowerCase() === "sol";
    const total = isSol ? amountNum + networkFee : amountNum;
    return total.toFixed(6);
  };

  const isValidSolanaAddress = (address: string): boolean => {
    try {
      // Check if it's a .sol domain (SNS)
      if (address.endsWith(".sol")) {
        // Basic validation for .sol domains
        return address.length > 4 && /^[a-z0-9-]+\.sol$/.test(address);
      }

      // Validate as a Solana public key
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateForm = (): boolean => {
    setError("");

    if (!asset) {
      setError("Please select an asset");
      return false;
    }

    if (!recipient.trim()) {
      setError("Please enter a recipient address");
      return false;
    }

    // Validate Solana address using PublicKey
    if (!isValidSolanaAddress(recipient.trim())) {
      setError("Invalid Solana address or .sol domain");
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    const amountNum = parseFloat(amount);
    const isSol = asset.toLowerCase() === "sol";
    const requiredBalance = isSol ? amountNum + networkFee : amountNum;

    if (requiredBalance > availableBalance) {
      setError(
        `Insufficient balance. Available: ${availableBalance.toFixed(
          6
        )} ${asset.toUpperCase()}`
      );
      return false;
    }

    if (amountNum < 0.000001) {
      setError("Amount too small. Minimum: 0.000001");
      return false;
    }

    return true;
  };

  const handleReviewTransaction = () => {
    if (validateForm()) {
      setIsTxnConfirmModalOpen(true);
    }
  };

  const handleConfirmTransaction = async () => {
    const payload: any = {
      toAddress: recipient.trim(),
      amount: parseFloat(amount),
      decimals: asset
        ? tokens.find((t) => t.symbol === asset)?.decimals || 0
        : 0,
    };
    const token = asset ? tokens.find((t) => t.symbol === asset) : undefined;

    if (token && asset.toLowerCase() !== "sol") {
      if (token.tokenProgramId) {
        Object.assign(payload, { tokenProgramId: token.tokenProgramId });
      }
      if (token.mint) {
        // fix: API expects tokenMint
        Object.assign(payload, { tokenMint: token.mint });
      }
    }
    mutation.mutate(payload);
  };

  return (
    <main className="flex-1 p-8 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-2xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <p className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">
            Send
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Recipient */}
          <div className="flex flex-col">
            <label
              htmlFor="recipient"
              className="text-text-primary text-base font-medium leading-normal pb-2"
            >
              Recipient
            </label>
            <div className="relative flex w-full items-stretch">
              <input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter SOL address or .sol name"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary border border-border bg-background-light dark:bg-card-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 h-14 placeholder:text-text-secondary p-4 text-base font-normal leading-normal"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  onClick={handlePaste}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  title="Paste from clipboard"
                >
                  <span className="material-symbols-outlined">
                    content_paste
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Asset & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="asset"
                className="text-text-primary text-base font-medium leading-normal pb-2"
              >
                Asset
              </label>
              <div className="relative">
                <select
                  id="asset"
                  value={asset}
                  onChange={(e) => {
                    setAsset(e.target.value);
                    setAmount("");
                    setError("");
                  }}
                  className="form-select appearance-none w-full min-w-0 resize-none overflow-hidden rounded-lg text-text-primary border border-border bg-background-light dark:bg-card-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 h-14 p-4 text-base font-normal leading-normal"
                >
                  <option value="" disabled>
                    Select Asset...
                  </option>
                  {tokens.map((token) => (
                    <option key={token.mint} value={token.symbol}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                  unfold_more
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                {asset ? (
                  <>
                    Available: {availableBalance.toFixed(6)}{" "}
                    {asset.toUpperCase()}
                  </>
                ) : (
                  "Available: --"
                )}
              </p>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="amount"
                className="text-text-primary text-base font-medium leading-normal pb-2"
              >
                Amount
              </label>
              <div className="relative flex w-full items-stretch">
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  placeholder="0.00"
                  step="0.000001"
                  min="0"
                  disabled={!asset}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary border border-border bg-background-light dark:bg-card-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 h-14 placeholder:text-text-secondary p-4 pr-16 text-base font-normal leading-normal disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    disabled={!asset}
                    className="text-primary text-sm font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <p className="text-text-secondary">Network Fee</p>
              <p className="text-text-primary font-medium">
                ~{networkFee.toFixed(6)} SOL
              </p>
            </div>
            <div className="flex justify-between items-center text-base">
              <p className="text-text-secondary font-medium">Total Debit</p>
              <p className="text-text-primary font-bold">
                {calculateTotalDebit()} {asset ? asset.toUpperCase() : ""}
              </p>
            </div>
          </div>

          {/* Primary Button */}
          <div className="pt-4">
            <button
              onClick={handleReviewTransaction}
              disabled={mutation.isPending || !asset || !recipient || !amount}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">
                {mutation.isPending ? "Processing..." : "Review Transaction"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <SendTransactionConfirmation
        visible={isTxnConfirmModalOpen}
        onConfirm={handleConfirmTransaction}
        onCancel={() => {
          setIsTxnConfirmModalOpen(false);
          setError("");
        }}
        recipient={recipient}
        amount={amount}
        asset={asset}
        networkFee={networkFee}
        totalDebit={calculateTotalDebit()}
        isLoading={mutation.isPending}
      />
    </main>
  );
};

export default Send;
