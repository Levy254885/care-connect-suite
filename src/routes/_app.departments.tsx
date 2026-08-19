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
import {
  createDepartment,
  deleteDepartment,
  listDepartments,
  seedCoreDepartments,
  updateDepartment,
} from "@/lib/data/admin";
import { humanizeError } from "@/lib/errors";

export const Route = createFileRoute("/_app/departments")({
  component: () => (
    <ModuleGuard module="departments">
      <DepartmentsPage />
    </ModuleGuard>
  ),
});

function DepartmentsPage() {
  const actor = useActor();
  const qc = useQueryClient();
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const refresh = () => void qc.invalidateQueries({ queryKey: ["departments"] });

  const create = useMutation({
    mutationFn: () =>
      createDepartment(actor, { name: name.trim(), code: code.trim().toUpperCase(), description, status: "ACTIVE" }),
    onSuccess: () => {
      toast.success("Department created.");
      setName("");
      setCode("");
      setDescription("");
      refresh();
    },
    onError: (e) => toast.error(humanizeError(e, "Could not create the department.")),
  });

  const seed = useMutation({
    mutationFn: () => seedCoreDepartments(actor),
    onSuccess: () => {
      toast.success("Core departments seeded.");
      refresh();
    },
    onError: (e) => toast.error(humanizeError(e, "Could not seed departments.")),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Clinical and administrative units used across the hospital."
        actions={
          <Button variant="outline" onClick={() => seed.mutate()} disabled={seed.isPending}>
            Seed core departments
          </Button>
        }
      />

      <Panel>
        <PanelHeader title="Add a department" />
        <form
          className="grid gap-4 px-5 py-5 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !code.trim()) {
              toast.error("Name and code are required.");
              return;
            }
            create.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="code">Code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={create.isPending}>
              Add department
            </Button>
          </div>
        </form>
      </Panel>

      <Panel>
        <PanelHeader title="All departments" description={`${departments.data?.length ?? 0} total`} />
        {departments.isLoading ? (
          <LoadingState />
        ) : (departments.data ?? []).length === 0 ? (
          <EmptyState title="No departments yet" description="Seed the core list or add your own." />
        ) : (
          <ul className="divide-y divide-border">
            {(departments.data ?? []).map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {d.name} <span className="text-muted-foreground">({d.code})</span>
                  </p>
                  {d.description ? (
                    <p className="text-xs text-muted-foreground">{d.description}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={d.status === "ACTIVE" ? "success" : "neutral"}>
                    {d.status}
                  </StatusBadge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void updateDepartment(actor, d.id, {
                        status: d.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                      })
                        .then(refresh)
                        .catch((e) => toast.error(humanizeError(e, "Update failed.")))
                    }
                  >
                    {d.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      void deleteDepartment(actor, d.id, d.name)
                        .then(refresh)
                        .catch((e) => toast.error(humanizeError(e, "Delete failed.")))
                    }
                  >
                    Delete
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
