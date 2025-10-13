import React from "react";
import type { Toast } from "../hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  if (toasts.length === 0) return null;

  const getToastStyles = (type: Toast["type"]) => {
    const baseStyles =
      "p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between min-w-[300px] max-w-[500px]";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200`;
      case "error":
        return `${baseStyles} bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200`;
      case "warning":
        return `${baseStyles} bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200`;
      case "info":
      default:
        return `${baseStyles} bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200`;
    }
  };

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2"
      role="alert"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-center">
            <span className="mr-2 text-lg font-bold " aria-hidden="true">
              {getIcon(toast.type)}
            </span>
            <span className="flex-1">{toast.message}</span>
          </div>
          <button
            onClick={() => onRemoveToast(toast.id)}
            className="ml-4 text-lg font-bold hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
            aria-label="Close notification"
            type="button"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
