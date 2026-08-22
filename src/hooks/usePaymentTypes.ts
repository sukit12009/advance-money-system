import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { PaymentTypeInput } from "@/types/paymentType";

export function usePaymentTypes(includeInactive = false) {
  return useQuery({
    queryKey: ["paymentTypes", includeInactive],
    queryFn: () => api.getPaymentTypes(includeInactive),
  });
}

export function usePaymentTypeMutations() {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["paymentTypes"] });
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createPaymentType = useMutation({
    mutationFn: (data: PaymentTypeInput) => api.createPaymentType(data),
    onSuccess: async () => {
      await invalidate();
      toast.success("เพิ่มประเภทเอกสารสำเร็จ");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "เพิ่มประเภทเอกสารไม่สำเร็จ",
      ),
  });

  const updatePaymentType = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaymentTypeInput }) =>
      api.updatePaymentType(id, data),
    onSuccess: async () => {
      await invalidate();
      toast.success("แก้ไขประเภทเอกสารสำเร็จ");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "แก้ไขประเภทเอกสารไม่สำเร็จ",
      ),
  });

  const deletePaymentType = useMutation({
    mutationFn: (id: string) => api.deletePaymentType(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("ลบประเภทเอกสารสำเร็จ");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "ปิดใช้งานประเภทเอกสารไม่สำเร็จ",
      ),
  });

  const disablePaymentType = useMutation({
    mutationFn: (id: string) => api.disablePaymentType(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("ปิดใช้งานประเภทเอกสารแล้ว");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "ปิดใช้งานประเภทเอกสารไม่สำเร็จ",
      ),
  });

  return { createPaymentType, updatePaymentType, deletePaymentType, disablePaymentType };
}
