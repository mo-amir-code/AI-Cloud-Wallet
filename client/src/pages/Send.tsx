import { useState } from "react";
import {
  SendTransactionConfirmation,
} from "../components/modals";

const Send = () => {
  const [isTxnConfirmModalOpen, setIsTxnConfirmModalOpen] =
    useState<boolean>(false);

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
                placeholder="Enter SOL address or .sol name"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary border border-border bg-background-light dark:bg-card-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 h-14 placeholder:text-text-secondary p-4 text-base font-normal leading-normal"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
                <button className="text-text-muted hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined">
                    content_paste
                  </span>
                </button>
                <button className="text-text-muted hover:text-text-primary transition-colors">
                  <span className="material-symbols-outlined">
                    qr_code_scanner
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
                  className="form-select appearance-none w-full min-w-0 resize-none overflow-hidden rounded-lg text-text-primary border border-border bg-background-light dark:bg-card-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 h-14 p-4 text-base font-normal leading-normal"
                  defaultValue="sol"
                >
                  <option value="sol">Solana (SOL)</option>
                  <option value="usdc">USD Coin (USDC)</option>
                  <option value="usdt">Tether (USDT)</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                  unfold_more
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Available: 12.456 SOL
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
                  placeholder="0.00"
                  step="0.01"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary border border-border bg-background-light dark:bg-card-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 h-14 placeholder:text-text-secondary p-4 text-base font-normal leading-normal"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <button className="text-primary text-sm font-bold hover:underline">
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
              <p className="text-text-primary font-medium">~0.000005 SOL</p>
            </div>
            <div className="flex justify-between items-center text-base">
              <p className="text-text-secondary font-medium">Total Debit</p>
              <p className="text-text-primary font-bold">0.00 SOL</p>
            </div>
          </div>

          {/* Primary Button */}
          <div className="pt-4">
            <button
              onClick={() => setIsTxnConfirmModalOpen(true)}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">Review Transaction</span>
            </button>
          </div>
        </div>
      </div>

      <SendTransactionConfirmation
        visible={isTxnConfirmModalOpen}
        onConfirm={() => {}}
        onCancel={() => setIsTxnConfirmModalOpen(false)}
      />
    </main>
  );
};

export default Send;
