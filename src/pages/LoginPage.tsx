import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LoginPage({ message }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-950">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          กรุณาเข้าสู่ระบบด้วย Google Account ที่ได้รับอนุญาต
        </p>
        {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
        <Button type="button" className="mt-6 w-full" onClick={() => window.location.reload()}>
          เข้าสู่ระบบด้วย Google
        </Button>
      </section>
    </main>
  );
}
