import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel, PanelHeader } from "@/components/ui/page";
import { LoadingState } from "@/components/ui/state";
import { ModuleGuard, useActor } from "@/components/layout/module-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SETTINGS, getHospitalSettings, saveHospitalSettings } from "@/lib/data/admin";
import { humanizeError } from "@/lib/errors";
import type { HospitalSettings } from "@/lib/types";

export const Route = createFileRoute("/_app/settings")({
  component: () => (
    <ModuleGuard module="settings">
      <SettingsPage />
    </ModuleGuard>
  ),
});

function SettingsPage() {
  const actor = useActor();
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["hospital-settings"], queryFn: getHospitalSettings });
  const [form, setForm] = useState<HospitalSettings>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  function field<K extends keyof HospitalSettings>(key: K, value: HospitalSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveHospitalSettings(actor, form);
      await qc.invalidateQueries({ queryKey: ["hospital-settings"] });
      toast.success("Settings saved.");
    } catch (error) {
      toast.error(humanizeError(error, "Could not save settings."));
    } finally {
      setBusy(false);
    }
  }

  if (query.isLoading) return <LoadingState label="Loading settings…" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Hospital settings" description="Identity, billing and alert preferences." />
      <Panel>
        <PanelHeader title="General" />
        <form onSubmit={onSubmit} className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="hospitalName">Hospital name</Label>
            <Input
              id="hospitalName"
              value={form.hospitalName}
              onChange={(e) => field("hospitalName", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addressLine">Address</Label>
            <Input
              id="addressLine"
              value={form.addressLine ?? ""}
              onChange={(e) => field("addressLine", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone ?? ""}
              onChange={(e) => field("phone", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={form.email ?? ""}
              onChange={(e) => field("email", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={form.currency}
              onChange={(e) => field("currency", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoicePrefix">Invoice prefix</Label>
            <Input
              id="invoicePrefix"
              value={form.invoicePrefix}
              onChange={(e) => field("invoicePrefix", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="receiptFooter">Receipt footer</Label>
            <Input
              id="receiptFooter"
              value={form.receiptFooter ?? ""}
              onChange={(e) => field("receiptFooter", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="expiryAlertDays">Expiry alert (days)</Label>
            <Input
              id="expiryAlertDays"
              inputMode="numeric"
              value={String(form.expiryAlertDays)}
              onChange={(e) => field("expiryAlertDays", Number(e.target.value) || 0)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>
              Save settings
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
