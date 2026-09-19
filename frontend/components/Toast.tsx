import React, { useState, createContext, useContext, useCallback } from 'react';

/* ── Toast Context ───────────────────────────────────── */
interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const bgColor: Record<string, string> = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-700 text-white',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{ animation: 'slideUp 0.3s ease-out' }}
            className={`pointer-events-auto px-5 py-3 rounded-lg shadow-lg text-sm font-medium ${bgColor[t.type]}`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* legacy named export kept for _app.tsx compatibility */
export function ToastContainer() {
  return null; // Rendering is handled by ToastProvider
}
