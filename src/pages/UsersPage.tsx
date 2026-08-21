import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Edit, Plus, Power, Save } from "lucide-react";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/FormControls";
import { useUserMutations, useUsers } from "@/hooks/useAdminData";
import type { AppUser, UserInput } from "@/types/user";

const emptyUser: UserInput = {
  email: "",
  name: "",
  role: "user",
  active: true,
};

export function UsersPage() {
  const { data = [], isLoading } = useUsers();
  const mutations = useUserMutations();
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [form, setForm] = useState<UserInput>(emptyUser);

  useEffect(() => {
    if (!editing) return;
    setForm({
      email: editing.email,
      name: editing.name,
      role: editing.role,
      active: editing.active,
    });
  }, [editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing) {
      await mutations.updateUser.mutateAsync({ id: editing.id, data: form });
    } else {
      await mutations.createUser.mutateAsync(form);
    }
    setEditing(null);
    setForm(emptyUser);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="ผู้ใช้งาน"
        description="ควบคุมผู้ใช้ที่อนุญาตให้ใช้ระบบผ่าน users sheet"
      />

      <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_1fr_140px_130px_auto]" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="role">สิทธิ์</Label>
            <Select
              id="role"
              value={form.role}
              onChange={(event) =>
                setForm({ ...form, role: event.target.value as UserInput["role"] })
              }
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Select>
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
            />
            ใช้งาน
          </label>
          <div className="flex items-end gap-2">
            <Button
              type="submit"
              disabled={mutations.createUser.isPending || mutations.updateUser.isPending}
            >
              {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editing ? "บันทึก" : "เพิ่ม"}
            </Button>
            {editing ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyUser);
                }}
              >
                ยกเลิก
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      {isLoading ? <LoadingBlock /> : null}

      <section className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">อีเมล</th>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">สิทธิ์</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">{user.id}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3">
                  <Badge tone={user.role === "admin" ? "success" : "neutral"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={user.active ? "success" : "warning"}>
                    {user.active ? "ใช้งาน" : "ปิดใช้งาน"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="แก้ไข"
                      onClick={() => setEditing(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="ปิดใช้งาน"
                      onClick={() => mutations.deleteUser.mutate(user.id)}
                    >
                      <Power className="h-4 w-4 text-amber-700" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
