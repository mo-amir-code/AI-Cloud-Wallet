import React, { useState } from "react";

interface ReceiveProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const Receive: React.FC<ReceiveProps> = ({ visible, setVisible }) => {
  const [walletAddress] = useState(
    "4N6HhjwXo1Fp6L9cQqU8xkqV9G2o1WwKpD1Bv1o9Ck3n"
  );
  const [copied, setCopied] = useState(false);
  const qrCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    walletAddress;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-in fade-in duration-300"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-card-dark border border-border rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <button
            onClick={() => setVisible(false)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background-dark/80 backdrop-blur-sm hover:bg-background-dark border border-border transition-all flex items-center justify-center text-text-secondary hover:text-text-primary group"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl group-hover:rotate-90 transition-transform duration-300">
              close
            </span>
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-5 md:space-y-6">
          <div className="space-y-1 sm:space-y-1.5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
              Receive Solana
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Scan the QR code to receive SOL
            </p>
          </div>

          <div className="relative w-full flex justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl sm:blur-2xl rounded-full"></div>
            <div className="relative bg-white p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-2xl">
              <img
                src={qrCodeUrl}
                alt="Wallet QR Code"
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52"
              />
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-[10px] sm:text-xs text-text-secondary font-medium">
              Your Wallet Address
            </p>
            <div className="bg-background-dark border border-border rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4">
              <code className="text-text-primary font-mono text-[9px] xs:text-[10px] sm:text-xs break-all leading-relaxed">
                {walletAddress}
              </code>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            <div className="relative flex items-center justify-center gap-2 sm:gap-2.5 bg-primary text-background-dark font-semibold py-2.5 sm:py-3 md:py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
              <span className="material-symbols-outlined text-base sm:text-lg">
                {copied ? "check_circle" : "content_copy"}
              </span>
              <span className="text-xs sm:text-sm">
                {copied ? "Address Copied!" : "Copy Address"}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 border border-primary/20 rounded-full">
            <div className="relative">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-ping"></div>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-primary">
              Solana Mainnet
            </span>
          </div>
        </div>
      </div>

      {/* Google Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};
export default Receive;
