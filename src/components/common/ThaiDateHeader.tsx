import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactDatePickerCustomHeaderProps } from "react-datepicker";

export function ThaiDateHeader({ monthDate, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: ReactDatePickerCustomHeaderProps) {
  const month = new Intl.DateTimeFormat("th-TH", { month: "long" }).format(monthDate);
  const year = monthDate.getFullYear() + 543;
  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="rounded-md p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40" aria-label="เดือนก่อนหน้า"><ChevronLeft className="h-4 w-4" /></button>
      <span className="text-sm font-semibold text-slate-800">{month} {year}</span>
      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="rounded-md p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40" aria-label="เดือนถัดไป"><ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}
