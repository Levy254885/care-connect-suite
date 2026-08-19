import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, PanelHeader, StatusBadge } from "@/components/ui/page";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { ModuleGuard, useActor } from "@/components/layout/module-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createStaffUser,
  listDepartments,
  listUsers,
  sendUserPasswordReset,
  updateStaffUser,
} from "@/lib/data/admin";
import { humanizeError } from "@/lib/errors";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/types";

export const Route = createFileRoute("/_app/users")({
  component: () => (
    <ModuleGuard module="users">
      <UsersPage />
    </ModuleGuard>
  ),
});

function UsersPage() {
  const actor = useActor();
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("RECEPTIONIST");
  const [departmentId, setDepartmentId] = useState("");

  const create = useMutation({
    mutationFn: () =>
      createStaffUser(actor, {
        fullName,
        email,
        password,
        phone,
        role,
        departmentId: departmentId || null,
      }),
    onSuccess: () => {
      toast.success("Staff account created.");
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      void qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => toast.error(humanizeError(e, "Could not create the account.")),
  });

  const patch = useMutation({
    mutationFn: (vars: { uid: string; role?: Role; status?: "ACTIVE" | "DISABLED" }) =>
      updateStaffUser(actor, vars.uid, {
        ...(vars.role ? { role: vars.role } : {}),
        ...(vars.status ? { status: vars.status } : {}),
      }),
    onSuccess: () => {
      toast.success("Staff profile updated.");
      void qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => toast.error(humanizeError(e, "Could not update the profile.")),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      toast.error("Full name, email and a password of at least 8 characters are required.");
      return;
    }
    create.mutate();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users & staff" description="Provision accounts and manage roles." />

      <Panel>
        <PanelHeader title="Add a staff member" description="Creates a login and staff profile." />
        <form onSubmit={onSubmit} className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Temporary password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
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
          <div className="sm:col-span-2">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Create staff account
            </Button>
          </div>
        </form>
      </Panel>

      <Panel>
        <PanelHeader title="Staff directory" description={`${users.data?.length ?? 0} accounts`} />
        {users.isLoading ? (
          <LoadingState />
        ) : (users.data ?? []).length === 0 ? (
          <EmptyState title="No staff accounts yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(users.data ?? []).map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3">{u.fullName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3">
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={u.role}
                        onChange={(e) => patch.mutate({ uid: u.uid, role: e.target.value as Role })}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={u.status === "ACTIVE" ? "success" : "danger"}>
                        {u.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            patch.mutate({
                              uid: u.uid,
                              status: u.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
                            })
                          }
                        >
                          {u.status === "ACTIVE" ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            void sendUserPasswordReset(actor, u.email)
                              .then(() => toast.success("Reset email sent."))
                              .catch((e) => toast.error(humanizeError(e, "Could not send reset.")))
                          }
                        >
                          Reset password
                        </Button>
                      </div>
                    </td>
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
