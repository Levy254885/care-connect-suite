import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, ShieldAlert } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      <p className="max-w-md text-sm text-foreground">{message}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function PermissionState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
      <ShieldAlert className="h-7 w-7 text-warning" aria-hidden />
      <p className="text-sm font-medium">You don't have access to this module</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your role doesn't include permission for this area. Contact a hospital administrator if you
        believe this is a mistake.
      </p>
    </div>
  );
}
