import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { CategoryInput } from "@/types/category";

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: ["categories", includeInactive],
    queryFn: () => api.getCategories(includeInactive),
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createCategory = useMutation({
    mutationFn: (data: CategoryInput) => api.createCategory(data),
    onSuccess: async () => {
      await invalidate();
      toast.success("เพิ่มหมวดหมู่สำเร็จ");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "เพิ่มหมวดหมู่ไม่สำเร็จ"),
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) =>
      api.updateCategory(id, data),
    onSuccess: async () => {
      await invalidate();
      toast.success("แก้ไขหมวดหมู่สำเร็จ");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "แก้ไขหมวดหมู่ไม่สำเร็จ"),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("ลบหมวดหมู่สำเร็จ");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "ปิดใช้งานหมวดหมู่ไม่สำเร็จ"),
  });

  const disableCategory = useMutation({
    mutationFn: (id: string) => api.disableCategory(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("ปิดใช้งานหมวดหมู่แล้ว");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "ปิดใช้งานหมวดหมู่ไม่สำเร็จ"),
  });

  return { createCategory, updateCategory, deleteCategory, disableCategory };
}
