import { useEffect, useRef } from "react";

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({
  title,
  message,
  confirmText = "Confirm",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        if (!isLoading) onCancel();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md
             max-h-[calc(100vh-2rem)] rounded-xl
             bg-white p-6 shadow-2xl
             backdrop:bg-black/40"
    >
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm text-slate-600">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmationDialog;
