import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import { LoadingBlock } from "@/components/common/LoadingBlock";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/FormControls";
import { useSettingMutation, useSettings } from "@/hooks/useAdminData";

export function SettingsPage() {
  const { data = [], isLoading } = useSettings();
  const mutation = useSettingMutation();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(Object.fromEntries(data.map((setting) => [setting.key, setting.value])));
  }, [data]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    for (const [key, value] of Object.entries(values)) {
      await mutation.mutateAsync({ key, value });
    }
  }

  const keys = ["startingBalance", "currency", "timezone"];

  return (
    <div className="space-y-5">
      <PageHeader
        title="ตั้งค่า"
        description="ค่าที่ backend ใช้คำนวณและจัดรูปแบบ เช่นยอดยกมา สกุลเงิน และ timezone"
      />

      {isLoading ? <LoadingBlock /> : null}

      <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <form className="grid gap-4 md:max-w-2xl" onSubmit={handleSubmit}>
          {keys.map((key) => (
            <div key={key}>
              <Label htmlFor={key}>{settingLabel(key)}</Label>
              <Input
                id={key}
                value={values[key] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="h-4 w-4" />
              บันทึกการตั้งค่า
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function settingLabel(key: string) {
  const labels: Record<string, string> = {
    startingBalance: "ยอดยกมา",
    currency: "สกุลเงิน",
    timezone: "Timezone",
  };
  return labels[key] ?? key;
}
