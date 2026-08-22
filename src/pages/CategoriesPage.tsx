import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Edit, Plus, Power, Save } from "lucide-react";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/FormControls";
import { useCategories, useCategoryMutations } from "@/hooks/useCategories";
import type { Category, CategoryInput } from "@/types/category";

const emptyCategory: CategoryInput = {
  name: "",
  active: true,
  sortOrder: 1,
};

export function CategoriesPage() {
  const { data = [], isLoading } = useCategories(true);
  const mutations = useCategoryMutations();
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>(emptyCategory);

  useEffect(() => {
    if (!editing) return;
    setForm({
      name: editing.name,
      active: editing.active,
      sortOrder: editing.sortOrder,
    });
  }, [editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing) {
      await mutations.updateCategory.mutateAsync({ id: editing.id, data: form });
    } else {
      await mutations.createCategory.mutateAsync(form);
    }
    setEditing(null);
    setForm(emptyCategory);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="หมวดหมู่"
        description="จัดการ master data ของหมวดหมู่รายการ"
      />

      <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_130px_130px_auto]" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="categoryName">ชื่อหมวดหมู่</Label>
            <Input
              id="categoryName"
              value={form.name}
              required
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="categorySort">ลำดับ</Label>
            <Input
              id="categorySort"
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm({ ...form, sortOrder: Number(event.target.value) })
              }
            />
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
                  setForm(emptyCategory);
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
        <table className="min-w-[620px] w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">ลำดับ</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => (
              <tr key={category.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">{category.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
                <td className="px-4 py-3">
                  <Badge tone={category.active ? "success" : "warning"}>
                    {category.active ? "ใช้งาน" : "ปิดใช้งาน"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">{category.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="แก้ไข"
                      onClick={() => setEditing(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="ปิดใช้งาน"
                      onClick={() => mutations.deleteCategory.mutate(category.id)}
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
