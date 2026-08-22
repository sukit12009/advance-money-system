import { LoaderCircle } from "lucide-react";

export function ApiLoadingOverlay({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 backdrop-blur-[1px]" aria-busy="true" aria-live="polite">
      <LoaderCircle className="h-16 w-16 animate-spin text-teal-700" />
    </div>
  );
}
