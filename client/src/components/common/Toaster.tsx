import { useToastStore, type ToastStatus } from "../../stores/useToastStore";

const Toaster = () => {
  const { toasts, removeToast } = useToastStore();

  const getStatusStyles = (status: ToastStatus) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 border-green-500/50 text-green-400 dark:text-green-300";
      case "error":
        return "bg-red-500/10 border-red-500/50 text-red-400 dark:text-red-300";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-400 dark:text-yellow-300";
      case "info":
        return "bg-primary/10 border-primary/50 text-primary";
      default:
        return "bg-text-muted/10 border-border text-text-secondary";
    }
  };

  const getStatusIcon = (status: ToastStatus) => {
    switch (status) {
      case "success":
        return "check_circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "notifications";
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md bg-card-light/95 dark:bg-card-dark/95 shadow-lg animate-in slide-in-from-right duration-300 ${getStatusStyles(
            toast.status
          )}`}
        >
          <span className="material-symbols-outlined text-xl mt-0.5 flex-shrink-0">
            {getStatusIcon(toast.status)}
          </span>
          <p className="flex-1 text-sm font-medium leading-relaxed break-words">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 -mt-1 -mr-1"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
