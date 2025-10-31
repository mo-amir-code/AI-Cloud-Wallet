import React from "react";

interface ConfirmSendModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  recipientAddress?: string;
  recipientName?: string;
  amount?: string;
  networkFee?: string;
  total?: string;
}

const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  recipientAddress = "8fA7...dE7b",
  recipientName = "example.sol",
  amount = "1.50 SOL",
  networkFee = "~0.000005 SOL",
  total = "1.500005 SOL",
}) => {
  if (!visible) return null;

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
              <div className="text-right">
                <span className="text-white text-sm font-mono block">
                  {recipientAddress}
                </span>
                <span className="text-xs text-gray-500">{recipientName}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Amount</span>
              <span className="text-white text-lg font-bold">{amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Network Fee</span>
              <span className="text-white text-sm font-mono">{networkFee}</span>
            </div>
          </div>

          <div className="border-t border-border-dark pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-300">Total</span>
              <span className="text-primary text-2xl font-extrabold">
                {total}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-b-2xl flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity"
          >
            <span className="truncate">Confirm &amp; Send</span>
          </button>
          <button
            onClick={onCancel}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent text-gray-300 hover:bg-white/10 text-base font-medium leading-normal transition-colors"
          >
            <span className="truncate">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSendModal;
