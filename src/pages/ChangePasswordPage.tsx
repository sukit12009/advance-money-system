import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/FormControls";
import { api } from "@/services/api";

export function ChangePasswordPage() {
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (values.newPassword !== values.confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    try {
      await api.changePassword(values.currentPassword, values.newPassword, values.confirmPassword);
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("เปลี่ยนรหัสผ่านสำเร็จ");
    } catch (changeError) {
      setError(changeError instanceof Error ? changeError.message : "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-950">เปลี่ยนรหัสผ่าน</h1>
      <form className="mt-5 grid gap-4" onSubmit={submit}>
        <div><Label htmlFor="currentPassword">รหัสผ่านเดิม</Label><Input id="currentPassword" type="password" required value={values.currentPassword} onChange={(e) => setValues({ ...values, currentPassword: e.target.value })} /></div>
        <div><Label htmlFor="newPassword">รหัสผ่านใหม่</Label><Input id="newPassword" type="password" minLength={8} required value={values.newPassword} onChange={(e) => setValues({ ...values, newPassword: e.target.value })} /></div>
        <div><Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label><Input id="confirmPassword" type="password" minLength={8} required value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} /></div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-teal-700">{message}</p> : null}
        <Button type="submit">เปลี่ยนรหัสผ่าน</Button>
      </form>
    </div>
  );
}
