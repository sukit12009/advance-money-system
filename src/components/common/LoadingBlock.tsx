export function LoadingBlock({ label = "กำลังโหลดข้อมูล..." }: { label?: string }) {
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-white p-4">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-20 animate-pulse rounded bg-slate-100" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
