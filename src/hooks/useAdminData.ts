import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { UserInput } from "@/types/user";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const createUser = useMutation({
    mutationFn: (data: UserInput) => api.createUser(data),
    onSuccess: async () => {
      await invalidate();
      toast.success("เพิ่มผู้ใช้งานสำเร็จ");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "เพิ่มผู้ใช้งานไม่สำเร็จ"),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserInput }) =>
      api.updateUser(id, data),
    onSuccess: async () => {
      await invalidate();
      toast.success("แก้ไขผู้ใช้งานสำเร็จ");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "แก้ไขผู้ใช้งานไม่สำเร็จ"),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("ปิดใช้งานผู้ใช้งานแล้ว");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "ปิดใช้งานผู้ใช้งานไม่สำเร็จ"),
  });

  return { createUser, updateUser, deleteUser };
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings(),
  });
}

export function useSettingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      api.updateSetting(key, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("บันทึกการตั้งค่าสำเร็จ");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "บันทึกการตั้งค่าไม่สำเร็จ"),
  });
}
