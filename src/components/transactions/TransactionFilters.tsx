import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/FormControls";
import type { Category } from "@/types/category";
import type { PaymentType } from "@/types/paymentType";
import type { ReceivedFilter, TransactionFilters as Filters } from "@/types/transaction";
import { TRANSACTION_TYPES } from "@/types/transaction";

interface TransactionFiltersProps {
  filters: Filters;
  categories: Category[];
  paymentTypes: PaymentType[];
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filters,
  categories,
  paymentTypes,
  onChange,
  onReset,
}: TransactionFiltersProps) {
  const setFilter = <TKey extends keyof Filters>(key: TKey, value: Filters[TKey]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div className="md:col-span-2">
          <Label htmlFor="search">ค้นหา</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="search"
              value={filters.search ?? ""}
              onChange={(event) => setFilter("search", event.target.value)}
              placeholder="รายการ หมวดหมู่ หรือหมายเหตุ"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="type">ประเภท</Label>
          <Select
            id="type"
            value={filters.type ?? "all"}
            onChange={(event) =>
              setFilter("type", event.target.value as Filters["type"])
            }
          >
            <option value="all">ทั้งหมด</option>
            {TRANSACTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="category">หมวดหมู่</Label>
          <Select
            id="category"
            value={filters.categoryId ?? ""}
            onChange={(event) => setFilter("categoryId", event.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="paymentType">ประเภทเอกสาร</Label>
          <Select
            id="paymentType"
            value={filters.paymentTypeId ?? ""}
            onChange={(event) => setFilter("paymentTypeId", event.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {paymentTypes.map((paymentType) => (
              <option key={paymentType.id} value={paymentType.id}>
                {paymentType.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="received">สถานะรับเงิน</Label>
          <Select
            id="received"
            value={filters.received ?? "all"}
            onChange={(event) =>
              setFilter("received", event.target.value as ReceivedFilter)
            }
          >
            <option value="all">ทั้งหมด</option>
            <option value="received">รับเงินแล้ว</option>
            <option value="pending">ยังไม่รับเงิน</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="dateFrom">วันที่เริ่มต้น</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(event) => setFilter("dateFrom", event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dateTo">วันที่สิ้นสุด</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(event) => setFilter("dateTo", event.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
            รีเซ็ต
          </Button>
        </div>
      </div>
    </section>
  );
}
