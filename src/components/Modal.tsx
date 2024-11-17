import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.FormEvent) => void;
  title: React.ReactNode;
  message: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-serif text-gray-800">{title}</div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">{message}</div>

          <form onSubmit={onConfirm}>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base font-medium"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-base font-medium"
              >
                {confirmText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
