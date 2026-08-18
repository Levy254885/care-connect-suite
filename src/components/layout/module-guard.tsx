import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { canAccess, type ModuleKey } from "@/lib/permissions";
import { PermissionState } from "@/components/ui/state";
import type { Actor } from "@/lib/data/admin";

export function ModuleGuard({ module, children }: { module: ModuleKey; children: ReactNode }) {
  const { profile } = useAuth();
  if (!canAccess(profile?.role, module)) return <PermissionState />;
  return <>{children}</>;
}

export function useActor(): Actor {
  const { profile } = useAuth();
  return {
    uid: profile?.uid ?? "unknown",
    name: profile?.fullName ?? "Unknown user",
    role: profile?.role ?? "UNKNOWN",
  };
}
