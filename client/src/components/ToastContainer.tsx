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
        return `${baseStyles} bg-green/80 backdrop-blur-sm border-green-400 text-green-500 `;
      case "error":
        return `${baseStyles} bg-red/80 backdrop-blur-sm border-red-400 text-red-500 `;
      case "warning":
        return `${baseStyles} bg-yellow/80 backdrop-blur-sm border-yellow-500 text-yellow-500 `;
      case "info":
      default:
        return `${baseStyles} bg-blue/80 backdrop-blur-sm border-blue-400 text-blue-500 `;
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
