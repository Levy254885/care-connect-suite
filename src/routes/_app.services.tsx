import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel, PanelHeader, StatusBadge } from "@/components/ui/page";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { ModuleGuard, useActor } from "@/components/layout/module-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createService, listDepartments, listServices, updateService } from "@/lib/data/admin";
import { formatMoney, useHospitalSettings } from "@/lib/use-hospital-settings";
import { humanizeError } from "@/lib/errors";

export const Route = createFileRoute("/_app/services")({
  component: () => (
    <ModuleGuard module="services">
      <ServicesPage />
    </ModuleGuard>
  ),
});

function ServicesPage() {
  const actor = useActor();
  const qc = useQueryClient();
  const { settings } = useHospitalSettings();
  const services = useQuery({ queryKey: ["services"], queryFn: listServices });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const refresh = () => void qc.invalidateQueries({ queryKey: ["services"] });

  const create = useMutation({
    mutationFn: () =>
      createService(actor, {
        name: name.trim(),
        price: Number(price),
        departmentId: departmentId || null,
        status: "ACTIVE",
      }),
    onSuccess: () => {
      toast.success("Service added.");
      setName("");
      setPrice("");
      refresh();
    },
    onError: (e) => toast.error(humanizeError(e, "Could not add the service.")),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Services & prices" description="Billable services and their current prices." />

      <Panel>
        <PanelHeader title="Add a service" />
        <form
          className="grid gap-4 px-5 py-5 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !Number.isFinite(Number(price))) {
              toast.error("Enter a service name and a valid price.");
              return;
            }
            create.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="svc-name">Service name</Label>
            <Input id="svc-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="svc-price">Price ({settings.currency})</Label>
            <Input
              id="svc-price"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="svc-dept">Department</Label>
            <select
              id="svc-dept"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Not assigned</option>
              {(departments.data ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={create.isPending}>
              Add service
            </Button>
          </div>
        </form>
      </Panel>

      <Panel>
        <PanelHeader title="Service catalogue" description={`${services.data?.length ?? 0} services`} />
        {services.isLoading ? (
          <LoadingState />
        ) : (services.data ?? []).length === 0 ? (
          <EmptyState title="No services yet" />
        ) : (
          <ul className="divide-y divide-border">
            {(services.data ?? []).map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(s.price, settings.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={s.status === "ACTIVE" ? "success" : "neutral"}>
                    {s.status}
                  </StatusBadge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const next = window.prompt(`New price for ${s.name}`, String(s.price));
                      if (next === null) return;
                      const value = Number(next);
                      if (!Number.isFinite(value)) {
                        toast.error("Enter a valid number.");
                        return;
                      }
                      void updateService(actor, s, { price: value })
                        .then(() => {
                          toast.success("Price updated.");
                          refresh();
                        })
                        .catch((e) => toast.error(humanizeError(e, "Update failed.")));
                    }}
                  >
                    Change price
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      void updateService(actor, s, {
                        status: s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                      })
                        .then(refresh)
                        .catch((e) => toast.error(humanizeError(e, "Update failed.")))
                    }
                  >
                    {s.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
