import { forwardRef, type InputHTMLAttributes } from "react";

function toBuddhistDisplay(value: unknown) {
  const text = String(value || "");
  const match = /^(\d{2}\/\d{2}\/)(\d{4})$/.exec(text);
  return match ? `${match[1]}${Number(match[2]) + 543}` : text;
}

export const ThaiDateInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ value, className, onClick, ...props }, ref) => (
    <input {...props} ref={ref} readOnly value={toBuddhistDisplay(value)} onClick={onClick} className={`h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-slate-900 shadow-sm ${className ?? ""}`} />
  ),
);

ThaiDateInput.displayName = "ThaiDateInput";
