import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/FormControls";
import { api } from "@/services/api";

export function CreateUserPage() {
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await api.registerUser({ ...form, role: "user", active: true });
      setMessage("สร้างผู้ใช้สำเร็จ กรุณาเข้าสู่ระบบ");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "สร้างผู้ใช้ไม่สำเร็จ");
    }
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl border bg-white p-8 shadow-sm"><h1 className="text-xl font-semibold">สร้างผู้ใช้</h1><div><Label htmlFor="registerEmail">อีเมล</Label><Input id="registerEmail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><div><Label htmlFor="registerName">ชื่อ</Label><Input id="registerName" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div><Label htmlFor="registerPassword">รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</Label><Input id="registerPassword" type="password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>{message ? <p className="text-sm text-teal-700">{message}</p> : null}<Button type="submit" className="w-full">สร้างผู้ใช้</Button><Link className="block text-center text-sm text-teal-700" to="/">กลับเข้าสู่ระบบ</Link></form></main>;
}
