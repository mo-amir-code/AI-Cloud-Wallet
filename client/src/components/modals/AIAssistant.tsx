

const AIAssistant = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card-dark/80 backdrop-blur-xl rounded-xl border border-border shadow-2xl">
        {/* Close button */}
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center px-8 pb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              mic
            </span>
            <h1 className="text-text-primary tracking-tight text-[32px] font-bold leading-tight text-center font-display">
              AI is listening...
            </h1>
          </div>
          <p className="text-text-secondary text-base font-normal leading-normal pt-2 px-4 text-center font-display">
            Speak your command now. e.g., "Send 0.5 SOL to address..."
          </p>

          {/* Waveform Animation */}
          <div className="flex w-full grow items-center justify-center h-40">
            <div className="flex w-full max-w-xs h-24 items-end justify-center gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="waveform-bar w-2 h-full bg-primary rounded-full"
                  style={{ animationDelay: `${-1.2 + i * 0.05}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Send Command Button */}
          <div className="flex w-full px-4 pt-4 pb-3 justify-center">
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] font-display transition-transform hover:scale-105 active:scale-100">
              <span className="truncate">Send Command</span>
            </button>
          </div>
        </div>
      </div>

      {/* Local styles for animation */}
      <style>
        {`
          .waveform-bar {
            animation: pulse 1.5s infinite ease-in-out;
            transform-origin: bottom;
          }
          @keyframes pulse {
            0%, 100% { transform: scaleY(0.2); }
            50% { transform: scaleY(1); }
          }
        `}
      </style>
    </div>
  );
};

export default AIAssistant;
