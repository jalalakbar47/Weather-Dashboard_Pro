import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const Toast = ({ toasts, onDismiss }) => (
  <div className="toast-stack" aria-live="polite" aria-atomic="true">
    {toasts.map((toast) => {
      const Icon = icons[toast.type] || Info;

      return (
        <div className={`toast toast--${toast.type}`} key={toast.id}>
          <Icon size={18} />
          <div className="toast__message">{toast.message}</div>
          <button className="icon-button icon-button--ghost" type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
            <X size={16} />
          </button>
        </div>
      );
    })}
  </div>
);

export default Toast;
