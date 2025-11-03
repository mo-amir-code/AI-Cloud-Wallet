import React from "react";

type ModalStatus = "warning" | "success" | "error" | "info";

interface ModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
  title: string;
  message: string;
  status?: ModalStatus;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onCancel,
  onOk,
  title,
  message,
  status = "info",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const statusConfig = {
    warning: {
      icon: "warning",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/5",
    },
    success: {
      icon: "check_circle",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-500",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
    },
    error: {
      icon: "error",
      iconBg: "bg-red/20",
      iconColor: "text-red",
      borderColor: "border-red/30",
      bgColor: "bg-red/5",
    },
    info: {
      icon: "info",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      borderColor: "border-primary/30",
      bgColor: "bg-primary/5",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`bg-card-dark border ${config.borderColor} rounded-xl max-w-md w-full p-6 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config.iconBg}`}>
            <span className={`material-symbols-outlined ${config.iconColor} text-2xl`}>
              {config.icon}
            </span>
          </div>
          <h2 className="text-text-primary text-xl font-bold">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-text-secondary text-sm">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-hover-light text-text-primary font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              status === "error" || status === "warning"
                ? "bg-red text-white hover:bg-red/90"
                : "bg-primary text-background-dark hover:bg-primary/90"
            }`}
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
