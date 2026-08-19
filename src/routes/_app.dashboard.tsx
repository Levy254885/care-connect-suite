import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, ScrollText, UserSquare2, Users } from "lucide-react";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/components/ui/page";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { ModuleGuard } from "@/components/layout/module-guard";
import { listAuditLogs, listDepartments, listUsers } from "@/lib/data/admin";
import { countPatients } from "@/lib/data/patients";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_app/dashboard")({
  component: () => (
    <ModuleGuard module="dashboard">
      <DashboardPage />
    </ModuleGuard>
  ),
});

function DashboardPage() {
  const { profile } = useAuth();
  const users = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });
  const patients = useQuery({ queryKey: ["patients-count"], queryFn: () => countPatients() });
  const logs = useQuery({ queryKey: ["audit-logs", 8], queryFn: () => listAuditLogs(8) });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile?.fullName ?? "colleague"}`}
        description="A live snapshot of hospital operations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered patients"
          value={patients.data ?? "—"}
          icon={<UserSquare2 className="h-4 w-4" />}
        />
        <StatCard
          label="Staff accounts"
          value={users.data?.length ?? "—"}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Active staff"
          value={users.data?.filter((u) => u.status === "ACTIVE").length ?? "—"}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Departments"
          value={departments.data?.length ?? "—"}
          icon={<Building2 className="h-4 w-4" />}
        />
      </div>

      <Panel>
        <PanelHeader title="Recent activity" description="Latest entries in the audit trail" />
        {logs.isLoading ? (
          <LoadingState />
        ) : (logs.data ?? []).length === 0 ? (
          <EmptyState title="No activity yet" description="Actions will appear here as staff use the system." />
        ) : (
          <ul className="divide-y divide-border">
            {(logs.data ?? []).map((log) => (
              <li key={log.id} className="flex items-start gap-3 px-5 py-3">
                <ScrollText className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm">{log.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.actorName} · {log.action}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
