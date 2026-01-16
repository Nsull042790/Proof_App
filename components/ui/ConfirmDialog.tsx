'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog(options);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = (result: boolean) => {
    if (resolvePromise) {
      resolvePromise(result);
    }
    setDialog(null);
    setResolvePromise(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Confirm Dialog */}
      {dialog && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[200] animate-fade-in"
            onClick={() => handleClose(false)}
          />
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-sm w-full animate-slide-up border border-[#2a2a2a]">
              <h3 className="text-xl font-bold text-white mb-2">{dialog.title}</h3>
              <p className="text-[#888888] mb-6">{dialog.message}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleClose(false)}
                  className="btn-secondary flex-1"
                >
                  {dialog.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    dialog.destructive
                      ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]'
                      : 'btn-primary'
                  }`}
                >
                  {dialog.confirmText || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
}
