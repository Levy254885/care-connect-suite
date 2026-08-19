import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Panel, PanelHeader } from "@/components/ui/page";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { ModuleGuard } from "@/components/layout/module-guard";
import { listAuditLogs } from "@/lib/data/admin";

export const Route = createFileRoute("/_app/audit-logs")({
  component: () => (
    <ModuleGuard module="audit">
      <AuditLogsPage />
    </ModuleGuard>
  ),
});

function AuditLogsPage() {
  const logs = useQuery({ queryKey: ["audit-logs", 200], queryFn: () => listAuditLogs(200) });

  return (
    <div className="space-y-6">
      <PageHeader title="Audit logs" description="Every privileged action recorded by the system." />
      <Panel>
        <PanelHeader title="Activity trail" description={`${logs.data?.length ?? 0} entries`} />
        {logs.isLoading ? (
          <LoadingState />
        ) : (logs.data ?? []).length === 0 ? (
          <EmptyState title="No audit entries yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-5 py-3 font-medium">Actor</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(logs.data ?? []).map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                      {log.createdAt ? log.createdAt.toDate().toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3">{log.actorName}</td>
                    <td className="px-5 py-3">{log.action}</td>
                    <td className="px-5 py-3 text-muted-foreground">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
