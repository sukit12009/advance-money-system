import { useState } from "react";
import type { FormEvent } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/FormControls";
import { api } from "@/services/api";
import { ApiLoadingOverlay } from "@/components/common/ApiLoadingOverlay";

export function LoginPage({ message }: { message?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(message || "");
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await api.login(email, password);
      localStorage.setItem("fern-auth-token", result.token);
      window.location.reload();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "เข้าสู่ระบบไม่สำเร็จ");
      setSubmitting(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <ApiLoadingOverlay open={submitting} />
      <section className="w-full max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-slate-950">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          กรุณาเข้าสู่ระบบด้วย Google Account ที่ได้รับอนุญาต
        </p>
        <form className="mt-6 grid gap-3 text-left" onSubmit={submit}>
          <div><Label htmlFor="loginEmail">อีเมล</Label><Input id="loginEmail" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div><Label htmlFor="loginPassword">รหัสผ่าน</Label><Input id="loginPassword" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full"><LogIn className="h-4 w-4" />เข้าสู่ระบบ</Button>
        </form>
      </section>
    </main>
  );
}
