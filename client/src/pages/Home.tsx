import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiveModal } from "../components/modals";
import type {
  TransactionInfo,
  TransactionType,
} from "../types/zustand/user.types";
import { useUserStore } from "../stores/useUserStore";
import axios from "axios";
import { SECRETS } from "../config/secrets";
import { getWalletTokens } from "../utils/axios/queries";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/query-keys";

const HELIUS_API_KEY = SECRETS.HELIUS_API_KEY;

// Helper function to format numbers and remove trailing zeros
const formatNumber = (num: number, decimals: number = 4): string => {
  return parseFloat(num.toFixed(decimals)).toString();
};

const Home: React.FC = () => {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState<boolean>(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const navigate = useNavigate();
  const { userInfo, settings, tokens, setTokens, setTotalBalance } =
    useUserStore();

  // Fetch wallet transactions using React Query
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useQuery<TransactionInfo[]>({
      queryKey: queryKeys.transactions.list(
        userInfo?.wallet.publicKey || "",
        settings?.mode || "devnet"
      ),
      queryFn: async () => {
        if (!userInfo?.wallet.publicKey || !settings?.mode) {
          return [];
        }

        const walletAddress = userInfo.wallet.publicKey;
        const network = settings.mode;

        const baseUrl =
          network === "mainnet"
            ? "https://api-mainnet.helius-rpc.com"
            : "https://api-devnet.helius-rpc.com";

        const response = await axios.get(
          `${baseUrl}/v0/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}`
        );

        const parsedTransactions: TransactionInfo[] = response.data.map(
          (tx: any) => {
            let type: TransactionType = "Sent";
            let address = "";
            let amount = "0";
            let tokenSymbol = "SOL";

            // Parse native transfers (SOL transfers)
            if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
              const transfer = tx.nativeTransfers[0];
              const lamports = transfer.amount || 0;
              const solAmount = formatNumber(lamports / 1e9);

              if (transfer.toUserAccount === walletAddress) {
                type = "Received";
                address = transfer.fromUserAccount || "Unknown";
                amount = `+${solAmount}`;
              } else {
                type = "Sent";
                address = transfer.toUserAccount || "Unknown";
                amount = `-${solAmount}`;
              }
              tokenSymbol = "SOL";
            }
            // Parse token transfers (SPL tokens)
            else if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
              const transfer = tx.tokenTransfers[0];
              const tokenAmount = transfer.tokenAmount || 0;

              if (transfer.toUserAccount === walletAddress) {
                type = "Received";
                address = transfer.fromUserAccount || "Unknown";
                amount = `+${tokenAmount}`;
              } else {
                type = "Sent";
                address = transfer.toUserAccount || "Unknown";
                amount = `-${tokenAmount}`;
              }
              tokenSymbol = transfer.tokenSymbol || "TOKEN";
            }
            // Handle swaps
            else if (tx.type === "SWAP") {
              type = "Swap";
              address = "DEX Protocol";
              amount = tx.description || "Token Swap";
              tokenSymbol = "";
            }

            // Format address (first 3 and last 4 characters)
            const formattedAddress =
              address && address !== "Unknown"
                ? `${address.slice(0, 3)}...${address.slice(-4)}`
                : "Unknown";

            // Format date
            const date = tx.timestamp
              ? new Date(tx.timestamp * 1000).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown date";

            // Determine status
            const status: "Completed" | "Pending" | "Failed" =
              tx.transactionError ? "Failed" : "Completed";

            return {
              type,
              address: formattedAddress,
              amount: tokenSymbol ? `${amount} ${tokenSymbol}` : amount,
              date,
              status,
              signature: tx.signature || "",
            };
          }
        );

        return parsedTransactions;
      },
      enabled: !!userInfo?.wallet.publicKey && !!settings?.mode,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    });

  // Fetch trending tokens using React Query
  const { data: trendingTokens = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: queryKeys.tokens.trending,
    queryFn: async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            category: "solana-ecosystem",
            order: "volume_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: "24h",
          },
        }
      );

      const trending = response.data.slice(0, 5).map((token: any) => ({
        name: token.name,
        symbol: token.symbol.toUpperCase(),
        logo: token.image,
        price: token.current_price,
        priceChange24h: token.price_change_percentage_24h || 0,
        mint: token.id,
      }));

      return trending;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  const getMyTokens = useCallback(async (): Promise<void> => {
    // Don't fetch if already loading or if we already have tokens
    if (isLoadingTokens || tokens.length > 0) {
      return;
    }

    if (userInfo?.wallet.publicKey && settings?.mode) {
      setIsLoadingTokens(true);
      const fetchedTokens = await getWalletTokens(
        userInfo.wallet.publicKey,
        settings.mode
      );
      setTokens(fetchedTokens);

      // Calculate total balance from all tokens
      const totalValue = fetchedTokens.reduce(
        (sum, token) => sum + token.value,
        0
      );
      setTotalBalance(totalValue);

      setIsLoadingTokens(false);
    }
  }, [
    userInfo?.wallet.publicKey,
    settings?.mode,
    setTokens,
    setTotalBalance,
    isLoadingTokens,
    tokens.length,
  ]);

  // Copy address to clipboard
  const handleCopyAddress = async () => {
    if (userInfo?.wallet.publicKey) {
      try {
        await navigator.clipboard.writeText(userInfo.wallet.publicKey);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } catch (error) {
        console.error("Failed to copy address:", error);
      }
    }
  };

  // Fetch tokens on component mount
  useEffect(() => {
    if (userInfo?.wallet.publicKey && settings?.mode) {
      getMyTokens();
    }
  }, [userInfo?.wallet.publicKey, settings?.mode]);

  // Calculate SOL balance for display
  const solToken = tokens.find((t) => t.symbol === "SOL");
  const solBalance = solToken ? parseFloat(solToken.balance) : 0;
  const totalBalanceUSD = tokens.reduce((sum, token) => sum + token.value, 0);

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all ease-in-out duration-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-text-primary text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Home
            </h1>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
              Welcome back, manage your assets.
            </p>
          </div>
          <button
            onClick={handleCopyAddress}
            className="w-full sm:w-auto flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-hover-light text-text-muted text-sm font-medium leading-normal tracking-[0.015em] transition-colors hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-base">
              {copiedAddress ? "check" : "content_copy"}
            </span>
            <span className="truncate">
              {copiedAddress ? "Copied!" : "Copy Address"}
            </span>
          </button>
        </header>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-dark p-5 sm:p-6">
            <p className="text-text-secondary text-sm sm:text-base font-medium leading-normal">
              Total Balance
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-text-primary tracking-light text-2xl sm:text-3xl font-bold leading-tight">
                {formatNumber(solBalance)}
              </p>
              <span className="font-semibold text-text-muted text-sm sm:text-base">
                SOL
              </span>
            </div>
            <p
              className={`${
                (solToken?.priceChange24h || 0) > 0
                  ? "text-primary"
                  : solToken?.priceChange24h !== 0
                  ? "text-red"
                  : "text-text-primary"
              } text-sm sm:text-base font-medium leading-normal`}
            >
              {solToken?.priceChange24h
                ? `${solToken.priceChange24h >= 0 ? "+" : ""}${formatNumber(
                    solToken.priceChange24h,
                    2
                  )}%`
                : "+0%"}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-dark p-5 sm:p-6">
            <p className="text-text-secondary text-sm sm:text-base font-medium leading-normal">
              Portfolio Value (USD)
            </p>
            <p className="text-text-primary tracking-light text-2xl sm:text-3xl font-bold leading-tight">
              ${formatNumber(totalBalanceUSD, 2)}
            </p>
            <p className="text-primary text-sm sm:text-base font-medium leading-normal">
              {tokens.length} {tokens.length === 1 ? "Token" : "Tokens"}
            </p>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex justify-start">
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/dashboard/send")}
              className="flex-1 sm:flex-initial py-2 flex min-w-[84px] max-w-full sm:max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:opacity-90"
            >
              <span className="material-symbols-outlined">north_east</span>
              <span className="truncate">Send</span>
            </button>

            <button
              onClick={() => setIsReceiveModalOpen((prev) => !prev)}
              className="flex-1 sm:flex-initial py-2 flex min-w-[84px] max-w-full sm:max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 bg-hover-light text-text-primary text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-white/10"
            >
              <span className="material-symbols-outlined">south_west</span>
              <span className="truncate">Receive</span>
            </button>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="flex flex-col">
          <h2 className="text-text-primary text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 sm:pb-4 pt-4 sm:pt-5">
            Recent Transactions
          </h2>

          {isLoadingTransactions ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-text-secondary">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center py-8 rounded-xl border border-border bg-card-dark">
              <p className="text-text-secondary">No transactions found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block w-full overflow-hidden rounded-xl border border-border bg-card-dark">
                <div className="overflow-auto max-h-[40vh]">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border text-text-secondary sticky top-0 bg-card-dark z-10">
                      <tr>
                        <th className="px-6 py-4 font-medium" scope="col">
                          Type
                        </th>
                        <th className="px-6 py-4 font-medium" scope="col">
                          Address
                        </th>
                        <th className="px-6 py-4 font-medium" scope="col">
                          Amount
                        </th>
                        <th className="px-6 py-4 font-medium" scope="col">
                          Date
                        </th>
                        <th className="px-6 py-4 font-medium" scope="col">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.map((tx) => (
                        <tr key={tx.signature}>
                          <td className="px-6 py-4 text-text-primary">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                  tx.type === "Sent"
                                    ? "bg-red/20 text-red"
                                    : tx.type === "Received"
                                    ? "bg-success-bg text-primary"
                                    : "bg-yellow/20 text-yellow"
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {tx.type === "Sent"
                                    ? "north_east"
                                    : tx.type === "Received"
                                    ? "south_west"
                                    : "sync"}
                                </span>
                              </div>
                              <span>{tx.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-text-muted">
                            {tx.address}
                          </td>
                          <td
                            className={`px-6 py-4 ${
                              tx.type === "Received"
                                ? "text-primary"
                                : "text-text-primary"
                            }`}
                          >
                            {tx.amount}
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {tx.date}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                tx.status === "Completed"
                                  ? "bg-success-bg text-primary"
                                  : tx.status === "Pending"
                                  ? "bg-yellow/20 text-yellow"
                                  : "bg-red/20 text-red"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-3 max-h-[40vh] overflow-auto rounded-xl border border-border bg-card-dark p-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.signature}
                    className="rounded-xl border border-border bg-background-dark p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            tx.type === "Sent"
                              ? "bg-red/20 text-red"
                              : tx.type === "Received"
                              ? "bg-success-bg text-primary"
                              : "bg-yellow/20 text-yellow"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {tx.type === "Sent"
                              ? "north_east"
                              : tx.type === "Received"
                              ? "south_west"
                              : "sync"}
                          </span>
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">
                            {tx.type}
                          </p>
                          <p className="text-text-muted text-xs font-mono">
                            {tx.address}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          tx.status === "Completed"
                            ? "bg-success-bg text-primary"
                            : tx.status === "Pending"
                            ? "bg-yellow/20 text-yellow"
                            : "bg-red/20 text-red"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-semibold text-lg ${
                          tx.type === "Received"
                            ? "text-primary"
                            : "text-text-primary"
                        }`}
                      >
                        {tx.amount}
                      </p>
                      <p className="text-text-secondary text-sm">{tx.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Trending Tokens & My Tokens Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Trending on Solana */}
          <div className="flex flex-col gap-4">
            <h3 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em]">
              Trending on Solana
            </h3>
            <div className="bg-card-dark border border-border rounded-xl p-2 space-y-1">
              {isLoadingTrending ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-text-secondary text-sm">
                    Loading trending tokens...
                  </p>
                </div>
              ) : trendingTokens.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-text-secondary text-sm">
                    No trending tokens available
                  </p>
                </div>
              ) : (
                trendingTokens.map((token: any, index: number) => (
                  <a
                    key={index}
                    href="#"
                    className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                  >
                    <img
                      alt={`${token.name} token icon`}
                      className="w-10 h-10 rounded-full bg-background-dark"
                      src={token.logo}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/40";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-medium truncate">
                        {token.name}
                      </p>
                      <p className="text-text-muted text-sm">{token.symbol}</p>
                    </div>
                    <div className="w-24 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 30"
                      >
                        <polyline
                          fill="none"
                          points={
                            token.priceChange24h >= 0
                              ? "0,25 10,15 20,20 30,10 40,12 50,5 60,8 70,15 80,10 90,18 100,15"
                              : "0,5 10,10 20,8 30,15 40,18 50,25 60,22 70,28 80,20 90,24 100,28"
                          }
                          stroke={
                            token.priceChange24h >= 0 ? "#0df259" : "#F44336"
                          }
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-medium">
                        $
                        {token.price < 1
                          ? formatNumber(token.price, 6)
                          : formatNumber(token.price, 2)}
                      </p>
                      <p
                        className={`text-sm ${
                          token.profitLoss24h > 0
                            ? "text-primary"
                            : token.profitLoss24h === 0
                            ? "text-text-muted"
                            : "text-red"
                        }`}
                      >
                        {token.priceChange24h >= 0 ? "+" : ""}
                        {formatNumber(token.priceChange24h, 1)}%
                      </p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* My Tokens */}
          <div className="flex flex-col gap-4">
            <h3 className="text-text-primary text-xl font-bold leading-tight tracking-[-0.015em]">
              My Tokens
            </h3>
            <div className="bg-card-dark border border-border rounded-xl p-2 space-y-1 max-h-[400px] overflow-y-auto">
              {isLoadingTokens ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-text-secondary text-sm">
                    Loading your tokens...
                  </p>
                </div>
              ) : tokens.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-text-secondary text-sm">No tokens found</p>
                </div>
              ) : (
                tokens.map((token, index) => (
                  <a
                    key={index}
                    href="#"
                    className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                  >
                    <img
                      alt={`${token.name} token icon`}
                      className="w-10 h-10 rounded-full bg-background-dark"
                      src={token.logo || "https://via.placeholder.com/40"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/40";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-medium truncate">
                        {token.name}
                      </p>
                      <p className="text-text-muted text-sm">
                        {formatNumber(parseFloat(token.balance))} {token.symbol}
                      </p>
                    </div>
                    <div className="w-24 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 30"
                      >
                        <polyline
                          fill="none"
                          points={
                            token.profitLoss24h > 0
                              ? "0,25 10,15 20,20 30,10 40,12 50,5 60,8 70,15 80,10 90,18 100,15"
                              : token.profitLoss24h === 0
                              ? "0,15 10,15 20,15 30,15 40,15 50,15 60,15 70,15 80,15 90,15 100,15"
                              : "0,8 10,12 20,10 30,18 40,20 50,22 60,25 70,20 80,24 90,26 100,28"
                          }
                          stroke={
                            token.profitLoss24h > 0
                              ? "#0df259"
                              : token.profitLoss24h === 0
                              ? "#90cba4"
                              : "#F44336"
                          }
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-medium">
                        ${formatNumber(token.value, 2)}
                      </p>
                      <p
                        className={`text-sm ${
                          token.profitLoss24h > 0
                            ? "text-primary"
                            : token.profitLoss24h === 0
                            ? "text-text-muted"
                            : "text-red"
                        }`}
                      >
                        {token.profitLoss24h > 0 ? "+" : ""}$
                        {formatNumber(Math.abs(token.profitLoss24h), 2)}
                      </p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <ReceiveModal
        visible={isReceiveModalOpen}
        setVisible={setIsReceiveModalOpen}
      />
    </main>
  );
};

export default Home;
