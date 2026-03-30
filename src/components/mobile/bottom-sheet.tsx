"use client";

import { useEffect } from "react";

interface BottomSheetProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl transition-transform duration-300 ease-out lg:hidden max-h-[85vh] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-muted">
            <h3 className="font-serif text-lg">{title}</h3>
            <button onClick={onClose} className="text-xl text-secondary p-1">&times;</button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-4 py-4 safe-area-bottom" style={{ maxHeight: "70vh" }}>
          {children}
        </div>
      </div>
    </>
  );
}
