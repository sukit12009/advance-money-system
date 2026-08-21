import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { TransactionFilters, TransactionInput } from "@/types/transaction";

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => api.getTransactions(filters),
  });
}

export function useTransactionMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["transactions"] });

  const createTransaction = useMutation({
    mutationFn: (data: TransactionInput) => api.createTransaction(data),
    onSuccess: async () => {
      await invalidate();
      toast.success("บันทึกรายการสำเร็จ");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "บันทึกรายการไม่สำเร็จ");
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionInput }) =>
      api.updateTransaction(id, data),
    onSuccess: async () => {
      await invalidate();
      toast.success("แก้ไขรายการสำเร็จ");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "แก้ไขรายการไม่สำเร็จ");
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => api.deleteTransaction(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("ลบรายการสำเร็จ");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "ลบรายการไม่สำเร็จ");
    },
  });

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
